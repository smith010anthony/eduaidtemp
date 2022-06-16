import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import PredefinedPolls from '/imports/api/predefined-polls';
import KnexConnection from '/imports/startup/server/knexConnection';

export default function removePublishedPoll(meetingId, id) {
  check(meetingId, String);
  check(id, Number);

  const selector = {
    meetingId,
    id,
  };
  const query = KnexConnection('poll_questions')
    .where({ id })
    .update({
      published: true,
    });
  query.then((ids) => {
    check(ids, Number);
    const cb = (err) => {
      if (err) {
        return Logger.error(`Marked published from collection: ${err}`);
      }
      return Logger.info(`Marked published Poll id=${id}`);
    };
    const modifier = {
      $set: {
        published: true,
      },
    };
    return PredefinedPolls.update(selector, modifier, cb);
  }).catch(reason => Logger.error(`Error marking poll as published for meeting with id = ${meetingId} due to ${reason}`));
}
