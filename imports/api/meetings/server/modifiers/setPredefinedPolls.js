import Meetings from '/imports/api/meetings';
import Logger from '/imports/startup/server/logger';
import { check } from 'meteor/check';

export default function setPredefinedPolls(meetingId, polls) {
  check(meetingId, String);
  check(polls, Array);

  const selector = {
    meetingId,
  };

  const modifier = {
    $set: {
      predefinedPolls: polls,
    },
  };

  const cb = (err) => {
    if (err != null) {
      return Logger.error(`Setting predefinedPolls=${polls} for meetingId=${meetingId}`);
    }

    return Logger.info(`Set predefinedPolls=${polls} in meeitingId=${meetingId}`);
  };

  return Meetings.upsert(selector, modifier, cb);
}
