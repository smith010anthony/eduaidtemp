import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Logger from '/imports/startup/server/logger';
import Users from '/imports/api/users';

export default function createDummyUser(meetingId, userId, authToken) {
  check(meetingId, String);
  check(userId, String);
  check(authToken, String);

  const User = Users.findOne({ meetingId, userId });
  if (User) {
    throw new Meteor.Error('existing-user', 'Tried to create a dummy user for an existing user');
  }

  const doc = {
    meetingId,
    userId,
    authToken,
    clientType: 'HTML5',
    validated: null,
    left: false,
  };

  try {
    const insertedId = Users.insert(doc);

    if (insertedId) {
      Logger.info(`Created dummy user id=${userId} token=${authToken} meeting=${meetingId}`);
    }
  } catch (err) {
    Logger.error(`Creating dummy user to collection: ${err}`);
  }
}
