import { check } from 'meteor/check';
import setPublishedPoll from '../../../meetings/server/modifiers/setPublishedPoll';
import handleSendSystemChatForPublishedPoll from './sendPollChatMsg';
import setPublishedPollResult from '../../../meetings/server/modifiers/setPublishedPollResult';
import Polls from '../../index';


const POLL_CHAT_MESSAGE = Meteor.settings.public.poll.chatMessage;

export default function pollPublished({ body }, meetingId) {
  // const { pollId } = body;
  const { pollId, poll: { numRespondents, numResponders } } = body;

  check(meetingId, String);
  check(pollId, String);
  check(numRespondents, Number);
  check(numResponders, Number);


  setPublishedPoll(meetingId, true);
  //if (numResponders === 0) {
    const poll = Polls.findOne({ meetingId });
    setPublishedPollResult(meetingId, { ...poll, numRespondents, numResponders });
  //}

  if (POLL_CHAT_MESSAGE) {
    handleSendSystemChatForPublishedPoll({ body }, meetingId);
  }
}
