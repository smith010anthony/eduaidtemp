import { Meteor } from 'meteor/meteor';

const PredefinedPolls = new Mongo.Collection('predefined-polls');

if (Meteor.isServer) {
  // We can have just one active poll per meeting
  // makes no sense to index it by anything other than meetingId

  PredefinedPolls._ensureIndex({ meetingId: 1 });
}

export default PredefinedPolls;
