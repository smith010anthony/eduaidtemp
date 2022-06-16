import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Presentations from '/imports/api/presentations';
import PresentationAreaService from '/imports/ui/components/presentation/service';
import PollResult from '/imports/ui/components/poll-result/component';
import Service from '/imports/ui/components/poll/service';
import Auth from '../../services/auth';
import Meetings from '../../../api/meetings';
import { withModalMounter } from '../common/modal/service';

// eslint-disable-next-line max-len
const PollResultContainer = ({ hasPublishedPoll, ...props }) => (hasPublishedPoll ? <PollResult {...props} /> : null);

export default withModalMounter(withTracker(({ mountModal }) => {
  const currentMeeting = Meetings.findOne({ meetingId: Auth.meetingID },
    {
      fields: {
        publishedPoll: 1, voiceProp: 1, poll: 1, publishedPollResult: 1,
      },
    });
  
  const { publishedPoll, publishedPollResult } = currentMeeting;

  // console.log('[poll-result] @edu201 currentMeeting ',currentMeeting);
  console.log('[poll-result] @edu201 publishedPoll, publishedPollResult ',publishedPoll, publishedPollResult);

  const currentPresentation = Presentations.findOne({
    current: true,
  }, { fields: { podId: 1 } }) || {};

  const currentSlide = PresentationAreaService.getCurrentSlide(currentPresentation.podId);
  return ({
    closeModal: () => {
      mountModal(null);
    },
    currentSlide,
    amIPresenter: Service.amIPresenter(),
    pollTypes: Service.pollTypes,
    stopPoll: Service.stopPoll,
    publishPoll: Service.publishPoll,
    currentPoll: publishedPollResult,
    resetPollPanel: Session.get('resetPollPanel') || false,
    pollAnswerIds: Service.pollAnswerIds,
    isMeteorConnected: Meteor.status().connected,
    hasPublishedPoll: publishedPoll,
  });
})(PollResultContainer));
