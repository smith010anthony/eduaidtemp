import { Meteor } from 'meteor/meteor';
import PredefinedPolls from '/imports/api/predefined-polls';
import { extractCredentials } from '/imports/api/common/server/helpers';
import Logger from '/imports/startup/server/logger';

function predefinedPoll() {
  if (!this.userId) {
    return PredefinedPolls.find({ meetingId: '' });
  }
  const { meetingId } = extractCredentials(this.userId);

  const selector = {
    meetingId
  };
  

  return PredefinedPolls.find(selector);
  // Logger.info(`=====================================`);
  // Logger.info(`=====================================`);
  // Logger.info(`finding predefined-polls for meeting=${meetingId}`);
  // Logger.info(`finding predefined-polls for meeting `,predefinedpl);
  // return predefinedpl;
}

function publishPredefinedPoll(...args) {
  const boundPolls = predefinedPoll.bind(this);
  return boundPolls(...args);
}
Meteor.publish('predefined-polls', publishPredefinedPoll);
