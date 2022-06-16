import { Meteor } from 'meteor/meteor';
import removePublishedPoll from './methods/removePublishedPoll';
import updatePredefinedPoll from './methods/updatePredefinedPoll';
import addPredefinedPoll from './methods/addPredefinedPoll';

Meteor.methods({
  removePublishedPoll,
  addPredefinedPoll,
  updatePredefinedPoll,
});
