import Users from '/imports/api/users';
import { makeCall } from '/imports/ui/services/api';
import Auth from '/imports/ui/services/auth';
import PredefinedPolls from '/imports/api/predefined-polls';

const sortUsers = (a, b) => {
  const sortByResponse = (a, b) => {
    const DEFAULT_CHAR = '-';
    const _a = a.answer.toLowerCase();
    const _b = b.answer.toLowerCase();
    const isDefault = (_a === DEFAULT_CHAR || _b === DEFAULT_CHAR);

    if (_a < _b || isDefault) {
      return -1;
    } if (_a > _b) {
      return 1;
    }
    return 0;
  };

  const sortByName = (a, b) => {
    const _a = a.name.toLowerCase();
    const _b = b.name.toLowerCase();

    if (_a < _b) {
      return -1;
    } if (_a > _b) {
      return 1;
    }
    return 0;
  };

  let sort = sortByResponse(a, b);
  if (sort === 0) sort = sortByName(a, b);
  return sort;
};

export default {
  sortUsers,
  // publishPoll: () => makeCall('publishPoll'),
  getUser: userId => Users.findOne({ userId }),
  publishPoll: (id) => {
    makeCall('publishPoll');
    if (id) {
      makeCall('removePublishedPoll', Auth.meetingID, id);
    }
  },
  predefinedPollById: id => PredefinedPolls.findOne({ meetingId: Auth.meetingID, id }),
};
