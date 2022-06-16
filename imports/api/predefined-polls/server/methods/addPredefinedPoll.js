import Logger from '/imports/startup/server/logger';
import { check } from 'meteor/check';
import KnexConnection from '/imports/startup/server/knexConnection';
import { extractCredentials } from '/imports/api/common/server/helpers';
import Meetings from '/imports/api/meetings';
import { uploadFile } from '/imports/utils/fileManager';
import PredefinedPolls from '/imports/api/predefined-polls/index';


function addPoll(meetingId, poll, extId, resolve, reject, fileName = null) {
  const selectQuery = KnexConnection.first('id')
    .from('video_conference_records')
    //.where({ meetingid: '05315532201820223220' });
    .where({ meetingid: extId });

  selectQuery.then((record) => {
    if (!record) reject(new Error('No meeting record found'));
    check(record, {
      id: Number,
    });
    Logger.info(`Got video_conference_record.id ${record.id} from eduaid postgres for meeting with id = ${extId}`);
    const query = KnexConnection('poll_questions')
      .returning('id')
      .insert({
        video_conference_record_id: record.id,
        question: poll.question,
        question_image: fileName,
        type: poll.type,
        options: poll.options,
        created_at: new Date(),
        updated_at: new Date(),
      });
    Logger.info(`Insert poll to postgres query: ${query.toString()}`);
    query.then((ids) => {
      check(ids, [Number]);
      const selector = {
        meetingId,
      };
      const cb = (err, numChanged) => {
        if (err != null) {
          Logger.error(`Adding Predefined Poll to collection: ${ids[0]}`);
        }

        const { insertedId } = numChanged;
        if (insertedId) {
          Logger.info(`Added Predefined Poll id=${ids[0]}`);
          resolve(ids[0]);
        }
        Logger.info(`Upserted Predefined Poll id=${ids[0]}`);
        resolve(ids[0]);
      };
      let imagePath = null;
      if (fileName != null && fileName !== '') {
        // imagePath = generateSignedFile(`admin/poll_question_images/${fileName}`);
        imagePath = 'https://inthenameofholygod.com/api/v1/download-file/?file=drqlIR1zoGR_EC8f4SDc1s_Y1HlFCfwG9kO0nI1J42rZyupk1NGjnb85nVI0Tz25fajYP6cZXJqOYQIx1VmnqYcqYzKoVmY0mqlsawFFrc0=';
      }
      const modifier = {
        meetingId,
        id: ids[0],
        question: poll.question,
        imagePath,
        published: false,
        type: poll.type,
        options: poll.options,
      };
      PredefinedPolls.upsert(selector, modifier, cb);
      Logger.info(`Inserted new poll in eduaid postgres ids: ${JSON.stringify(ids)}`);
    })
      .catch(reason => Logger.error(`Error inserting new poll to postgres for meeting with id = ${extId} due to ${reason}`));
  })
    .catch(reason => Logger.error(`Error getting video_conference_record for meeting with id = ${extId} due to ${reason}`));
}

export default async function addPredefinedPoll(poll) {
  check(poll, {
    question: String,
    questionImage: Match.OneOf(String, null),
    type: String,
    options: Match.OneOf(String, null),
  });
  return new Promise((resolve, reject) => {
    const { meetingId } = extractCredentials(this.userId);
    const meeting = Meetings.findOne({ meetingId }, { fields: { meetingProp: 1 } });
    const { extId } = meeting.meetingProp;
    if (!extId) reject(new Error('No meeting found'));

    if (poll.questionImage !== null) {
      uploadFile(poll.questionImage)
        .then((fileName) => {
          addPoll(meetingId, poll, extId, resolve, reject, fileName);
        })
        .catch(error => reject(error));
    } else {
      addPoll(meetingId, poll, extId, resolve, reject);
    }
  });
}
