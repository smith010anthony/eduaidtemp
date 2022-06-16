import Logger from '/imports/startup/server/logger';
import { check } from 'meteor/check';
import KnexConnection from '/imports/startup/server/knexConnection';
import PredefinedPolls from '/imports/api/predefined-polls';
import { generateSignedFile } from '/imports/utils/fileManager';


export default function addPredefinedPolls(meetingId, extMeetingId) {
  check(meetingId, String);

  const query = KnexConnection('video_conference_records')
    .join('poll_questions', 'video_conference_records.id', '=', 'poll_questions.video_conference_record_id')
    .where({ meetingid: extMeetingId })
    // .where({ meetingid: '05315532201820223220' })
    .select('poll_questions.*');
  Logger.info(`Poll fetch query to postgres: ${query.toString()}`);
  Logger.info('[predefined-poll] @edu ------------------+ ---------------------------++++');
  Logger.info('[predefined-poll] @edu ------------------+ ---------------------------++++');
  Logger.info('[predefined-poll] @edu ------------------+ ---------------------------++++');
  query.then((data) => {
    check(data, [{
      id: Number,
      video_conference_record_id: Number,
      question: String,
      type: String,
      question_image: Match.OneOf(String, null),
      options: Match.OneOf(String, null),
      published: Boolean,
      created_at: Date,
      updated_at: Date,
    }]);
    Logger.info('[predefined-poll] @edu +++++++++++++++++++++++ +++++++++++++++++++++++++++++++++++++');
    Logger.info('[predefined-poll] @edu +++++++++++++++++++++++ +++++++++++++++++++++++++++++++++++++');
    Logger.info('[predefined-poll] @edu +++++++++++++++++++++++ +++++++++++++++++++++++++++++++++++++');
    // Logger.info(`Got pre-defined polls from eduaid postgres: ${JSON.stringify(data)}`);
    data.forEach((poll) => {
      const selector = {
        meetingId,
        id: poll.id,
      };

      const {
        id, question, question_image: questionImage, type, options, published,
      } = poll;
      let imagePath = null;
      if (questionImage != null && questionImage !== '') {
        // imagePath = generateSignedFile(`admin/poll_question_images/${questionImage}`);
        imagePath = 'https://inthenameofholygod.com/api/v1/download-file/?file=drqlIR1zoGR_EC8f4SDc1s_Y1HlFCfwG9kO0nI1J42rZyupk1NGjnb85nVI0Tz25fajYP6cZXJqOYQIx1VmnqYcqYzKoVmY0mqlsawFFrc0=';
      }
      const modifier = {
        meetingId,
        id,
        question,
        published,
        imagePath,
        type,
        options,
      };

      const cb = (err, numChanged) => {
        if (err != null) {
          return Logger.error(`Adding Predefined Poll to collection: ${poll.id}`);
        }

        const { insertedId } = numChanged;
        if (insertedId) {
          return Logger.info(`Added Predefined Poll id=${poll.id}`);
        }

        return Logger.info(`Upserted Predefined Poll id=${poll.id}`);
      };

      return PredefinedPolls.upsert(selector, modifier, cb);
    });
  }).catch(reason => Logger.error(`Error getting pre-defined polls for meeting with id = ${meetingId} due to ${reason}`));
}
