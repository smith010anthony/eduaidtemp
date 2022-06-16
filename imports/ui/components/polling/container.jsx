import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import PollingService from './service';
import PollService from '/imports/ui/components/poll/service';
import PollingComponent from './component';
import { isPollingEnabled } from '/imports/ui/services/features';
import PredefinedPolls from '/imports/api/predefined-polls';

const propTypes = {
  pollExists: PropTypes.bool.isRequired,
};

const PollingContainer = ({ pollExists, ...props }) => {
  const currentUser = Users.findOne({ userId: Auth.userID }, { fields: { presenter: 1 } });
  const showPolling = pollExists && !currentUser.presenter && isPollingEnabled();

  if (showPolling) {
    return (
      <PollingComponent {...props} />
    );
  }
  return null;
};

PollingContainer.propTypes = propTypes;

export default withTracker(() => {
  const {
    pollExists, handleVote, poll, handleTypedVote,
  } = PollingService.mapPolls();
  const { pollTypes } = PollService;

  if (poll && poll?.pollType) {
    const isResponse = poll.pollType === pollTypes.Response;
    Meteor.subscribe('polls', isResponse);
  }

  let id = null;
  if (pollExists && poll && poll.answers[0]) {
    id = +poll.answers[0].key;
  }

  return ({
    pollExists,
    handleVote,
    handleTypedVote,
    poll,
    pdPoll: id ? PredefinedPolls.findOne({ meetingId: Auth.meetingID, id }) : {},
    pollAnswerIds: PollService.pollAnswerIds,
    pollTypes,
    isDefaultPoll: PollService.isDefaultPoll,
    isMeteorConnected: Meteor.status().connected,
  });
})(PollingContainer);
