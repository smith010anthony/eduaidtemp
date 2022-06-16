import React, { useContext } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { injectIntl } from 'react-intl';
import getFromUserSettings from '/imports/ui/services/users-settings';
import Auth from '/imports/ui/services/auth';
import PresentationService from '/imports/ui/components/presentation/service';
import Presentations from '/imports/api/presentations';
import { UsersContext } from '../components-data/users-context/context';
import ActionsBar from './component';
import Service from './service';
import UserListService from '/imports/ui/components/user-list/service';
import ExternalVideoService from '/imports/ui/components/external-video-player/service';
import CaptionsService from '/imports/ui/components/captions/service';
import { layoutSelectOutput, layoutDispatch,layoutSelectInput } from '../layout/context';
import { isVideoBroadcasting } from '/imports/ui/components/screenshare/service';
import { isExternalVideoEnabled, isPollingEnabled } from '/imports/ui/services/features';
import lockContextContainer from '/imports/ui/components/lock-viewers/context/container';

import MediaService, {
  getSwapLayout,
  shouldEnableSwapLayout,
} from '../media/service';

import { ChatContext } from '/imports/ui/components/components-data/chat-context/context';
import { GroupChatContext } from '/imports/ui/components/components-data/group-chat-context/context';
import NotesService from '/imports/ui/components/notes/service';
const checkUnreadMessages = ({
  groupChatsMessages, groupChats, users, idChatOpen,
}) => {
  const activeChats = UserListService.getActiveChats({ groupChatsMessages, groupChats, users });
  const hasUnreadMessages = activeChats
    .filter((chat) => chat.userId !== idChatOpen)
    .some((chat) => chat.unreadCounter > 0);

  return hasUnreadMessages;
};
const ActionsBarContainer = (props) => {
  const actionsBarStyle = layoutSelectOutput((i) => i.actionBar);
  const layoutContextDispatch = layoutDispatch();
  const sidebarContent = layoutSelectInput((i) => i.sidebarContent);
  const { sidebarContentPanel } = sidebarContent;
  const usingUsersContext = useContext(UsersContext);
  const usingChatContext = useContext(ChatContext);
  const usingGroupChatContext = useContext(GroupChatContext);
  const { users } = usingUsersContext;

  const currentUser = { userId: Auth.userID, emoji: users[Auth.meetingID][Auth.userID].emoji };

  const amIPresenter = users[Auth.meetingID][Auth.userID].presenter;
  const { chats: groupChatsMessages } = usingChatContext;
  const { groupChat: groupChats } = usingGroupChatContext;
  const hasUnreadNotes = NotesService.hasUnreadNotes(sidebarContentPanel);
  const hasUnreadMessages = checkUnreadMessages(
    { groupChatsMessages, groupChats, users: users[Auth.meetingID] },
  );
  return (
    <ActionsBar {
      ...{
        ...props,
        currentUser,
        layoutContextDispatch,
        actionsBarStyle,
        amIPresenter,
        sidebarContent,
        hasUnreadMessages,
        hasUnreadNotes,
      }
    }
    />
  );
};

const PRESENTATION_DISABLED = Meteor.settings.public.layout.hidePresentation;
const SELECT_RANDOM_USER_ENABLED = Meteor.settings.public.selectRandomUser.enabled;
const RAISE_HAND_BUTTON_ENABLED = Meteor.settings.public.app.raiseHandActionButton.enabled;
const OLD_MINIMIZE_BUTTON_ENABLED = Meteor.settings.public.presentation.oldMinimizeButton;

export default lockContextContainer(withTracker(({userLocks}) => {
  const isChatLockedPublic = userLocks.userPublicChat;
  const isChatLockedPrivate = userLocks.userPrivateChat;
  return {
    amIModerator: Service.amIModerator(),
    stopExternalVideoShare: ExternalVideoService.stopWatching,
    enableVideo: getFromUserSettings('bbb_enable_video', Meteor.settings.public.kurento.enableVideo),
    isLayoutSwapped: getSwapLayout() && shouldEnableSwapLayout(),
    toggleSwapLayout: MediaService.toggleSwapLayout,
    handleTakePresenter: Service.takePresenterRole,
    currentSlidHasContent: PresentationService.currentSlidHasContent(),
    parseCurrentSlideContent: PresentationService.parseCurrentSlideContent,
    isSharingVideo: Service.isSharingVideo(),
    hasScreenshare: isVideoBroadcasting(),
    isCaptionsAvailable: CaptionsService.isCaptionsAvailable(),
    isMeteorConnected: Meteor.status().connected,
    isPollingEnabled: isPollingEnabled(),
    isPresentationDisabled: PRESENTATION_DISABLED,
    isSelectRandomUserEnabled: SELECT_RANDOM_USER_ENABLED,
    isRaiseHandButtonEnabled: RAISE_HAND_BUTTON_ENABLED,
    isOldMinimizeButtonEnabled: OLD_MINIMIZE_BUTTON_ENABLED,
    isThereCurrentPresentation: Presentations.findOne({ meetingId: Auth.meetingID, current: true },
      { fields: {} }),
    allowExternalVideo: isExternalVideoEnabled(),
    setEmojiStatus: UserListService.setEmojiStatus,
    isChatLockedPrivate,
    isChatLockedPublic
  }
})(injectIntl(ActionsBarContainer)));
