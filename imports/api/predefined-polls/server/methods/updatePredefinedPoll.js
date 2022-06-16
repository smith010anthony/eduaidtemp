import Logger from '/imports/startup/server/logger';
import { check } from 'meteor/check';
import KnexConnection from '/imports/startup/server/knexConnection';
import { uploadFile } from '/imports/utils/fileManager';
import PredefinedPolls from '/imports/api/predefined-polls/index';

function updatePoll(poll, resolve, reject, fileName = null) {
  const query = KnexConnection('poll_questions')
    .where({ id: poll.id });
  if (fileName) {
    query.update({
      question: poll.question,
      question_image: fileName,
      type: poll.type,
      options: poll.options,
      updated_at: new Date(),
    });
  } else {
    query.update({
      question: poll.question,
      type: poll.type,
      options: poll.options,
      updated_at: new Date(),
    });
  }
  Logger.info(`PredefinedPoll update query to postgres: ${query.toString()}`);
  query.then((ids) => {
    check(ids, Number);
    const selector = {
      meetingId: poll.meetingId,
      id: poll.id,
    };
    const cb = (err, numChanged) => {
      if (err != null) {
        Logger.error(`Adding Predefined Poll to collection: ${ids}`);
      }

      const { insertedId } = numChanged;
      if (insertedId) {
        Logger.info(`Added Predefined Poll id=${insertedId}`);
      }
      Logger.info(`Upserted Predefined Poll id=${poll.id}`);
      resolve(poll.id);
    };
    let imagePath = null;
    if (fileName != null && fileName !== '') {
      // imagePath = generateSignedFile(`admin/poll_question_images/${fileName}`);
      imagePath = 'https://inthenameofholygod.com/api/v1/download-file/?file=drqlIR1zoGR_EC8f4SDc1s_Y1HlFCfwG9kO0nI1J42rZyupk1NGjnb85nVI0Tz25fajYP6cZXJqOYQIx1VmnqYcqYzKoVmY0mqlsawFFrc0=';
    }
    const modifier = {
      $set: {
        question: poll.question,
        imagePath: imagePath || poll.imagePath,
        type: poll.type,
        options: poll.options,
      },
    };
    PredefinedPolls.update(selector, modifier, cb);
    Logger.info(`Updated poll in eduaid postgres ids: ${ids}`);
  }).catch(reason => Logger.error(`Error getting pre-defined polls for meeting with id = ${poll} due to ${reason}`));
}

export default async function updatePredefinedPoll(poll) {
  check(poll, {
    _id: String,
    meetingId: String,
    id: Number,
    question: String,
    questionImage: Match.OneOf(String, null),
    imagePath: Match.OneOf(String, null),
    type: String,
    options: Match.OneOf(String, null),
  });
  return new Promise((resolve, reject) => {
    if (poll.questionImage !== null && poll.questionImage.length > 20) {
      uploadFile(poll.questionImage).then((fileName) => {
        updatePoll(poll, resolve, reject, fileName);
      }).catch(error => reject(error));
    } else {
      updatePoll(poll, resolve, reject);
    }
  });
}
