import Meetings from '/imports/api/meetings';
import Logger from '/imports/startup/server/logger';
import { check } from 'meteor/check';

export default function setPublishedPollResult(meetingId, pollResult) {
  check(meetingId, String);
  check(pollResult, Object);

  const selector = {
    meetingId,
  };

  const modifier = {
    $set: {
      publishedPollResult: pollResult,
    },
  };

  const cb = (err) => {
    if (err != null) {
      return Logger.error(`Setting publishedPollResult=${pollResult} for meetingId=${meetingId}`);
    }

    return Logger.info(`Set publishedPollResult=${pollResult} in meeitingId=${meetingId}`);
  };

  return Meetings.upsert(selector, modifier, cb);
}
