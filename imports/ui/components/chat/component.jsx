import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import injectWbResizeEvent from '/imports/ui/components/presentation/resize-wrapper/component';
import Button from '/imports/ui/components/common/button/component';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import { Meteor } from 'meteor/meteor';
import ChatLogger from '/imports/ui/components/chat/chat-logger/ChatLogger';
import Styled from './styles';
import MessageFormContainer from './message-form/container';
import TimeWindowList from './time-window-list/container';
import ChatDropdownContainer from './chat-dropdown/container';
import { PANELS, ACTIONS } from '../layout/enums';
import { UserSentMessageCollection } from './service';
import Auth from '/imports/ui/services/auth';
import browserInfo from '/imports/utils/browserInfo';
import { isChatEnabled } from '/imports/ui/services/features';

const CHAT_CONFIG = Meteor.settings.public.chat;
const PUBLIC_CHAT_ID = CHAT_CONFIG.public_id;
const ELEMENT_ID = 'chat-messages';
const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;
const intlMessages = defineMessages({
  closeChatLabel: {
    id: 'app.chat.closeChatLabel',
    description: 'aria-label for closing chat button',
  },
  hideChatLabel: {
    id: 'app.chat.hideChatLabel',
    description: 'aria-label for hiding chat button',
  },
  StartPrivateChat: {
    id: 'app.userList.menu.chat.label',
    description: 'label for option to start a new private chat',
  },
});

const Chat = (props) => {
  const {
    chatID,
    title,
    messages,
    partnerIsLoggedOut,
    isChatLocked,
    actions,
    intl,
    shortcuts,
    isMeteorConnected,
    lastReadMessageTime,
    hasUnreadMessages,
    scrollPosition,
    amIModerator,
    meetingIsBreakout,
    timeWindowsValues,
    dispatch,
    count,
    layoutContextDispatch,
    syncing,
    syncedPercent,
    lastTimeWindowValuesBuild,
    getGroupChatPrivate,
    currentUser,
    presenterUser,
    hasPrivateChatBetweenUsers
  } = props;

  const userSentMessage = UserSentMessageCollection.findOne({ userId: Auth.userID, sent: true });
  const { isChrome } = browserInfo;
  const HIDE_CHAT_AK = shortcuts.hideprivatechat;
  const CLOSE_CHAT_AK = shortcuts.closeprivatechat;
  const isPublicChat = chatID === PUBLIC_CHAT_ID;
  let allowedToChatPrivately = amIModerator ? false :   presenterUser?.userId!==currentUser.userId;

  // const { clientType } = presenterUser;
    const isDialInUser = false ;// clientType === 'dial-in-user';
  let enablePrivateChat = false
  
  if(!amIModerator && presenterUser && presenterUser.userId){
    enablePrivateChat= currentUser.role === ROLE_MODERATOR
      ? allowedToChatPrivately
      : allowedToChatPrivately
      && (!(currentUser.locked && isChatLocked)
        || hasPrivateChatBetweenUsers(currentUser.userId, presenterUser.userId)
        || presenterUser.role === ROLE_MODERATOR) && isMeteorConnected;
  }
  let ischatAllowed= isChatEnabled()
            && enablePrivateChat
            && !isDialInUser
            && !meetingIsBreakout
            && isMeteorConnected;
            //&& !showNestedOptions;
  ChatLogger.debug('ChatComponent::render', props);
  // console.log('[chat] @edu14 component render', getGroupChatPrivate);
  return (
    <Styled.Chat
      isChrome={isChrome}
      data-test={isPublicChat ? 'publicChat' : 'privateChat'}
    >
      <Styled.Header>
        {/* <Styled.Title data-test="chatTitle"> */}

        <Styled.HideChatButton
          onClick={() => {
            layoutContextDispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
              value: true,
            });
            layoutContextDispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
              value: PANELS.CHAT,
            });
            layoutContextDispatch({
              type: ACTIONS.SET_ID_CHAT_OPEN,
              value: PUBLIC_CHAT_ID,
            });
          }}
          style={{ backgroundColor: isPublicChat ? '#0F70D7' :'#aaa'}}
        >
          Public
        </Styled.HideChatButton>
        { ischatAllowed && !currentUser.presenter ?
        <Styled.HideChatButton
          onClick={() => {
            //this.handleClose();
            console.log('[chat] @edu14 open private chat presenterUser',presenterUser);
            getGroupChatPrivate(currentUser.userId, presenterUser);
            layoutContextDispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
              value: true,
            });
            layoutContextDispatch({
              type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
              value: PANELS.CHAT,
            });
            layoutContextDispatch({
              type: ACTIONS.SET_ID_CHAT_OPEN,
              value: presenterUser.userId,
            });
          }}
          style={{ backgroundColor: isPublicChat ? '#aaa' : '#0F70D7' }}
        >
          Private
        </Styled.HideChatButton>
        : null }

          {/* <Styled.HideChatButton
            size="lg"
            ghost={isPublicChat ? false : true}
            color={isPublicChat ? "primary" : "defult"}
            // color="defult"
            onClick={() => {
              layoutContextDispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
                value: true,
              });
              layoutContextDispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
                value: PANELS.CHAT,
              });
              layoutContextDispatch({
                type: ACTIONS.SET_ID_CHAT_OPEN,
                value: PUBLIC_CHAT_ID,
              });
            }}
            aria-label={intl.formatMessage(intlMessages.hideChatLabel, { 0: title })}
            accessKey={chatID !== 'public' ? HIDE_CHAT_AK : null}
            data-test={isPublicChat ? 'hidePublicChat' : 'hidePrivateChat'}
            label={"public"}//{title}
            //icon="left_arrow"
          /> */}

          
        {/* </Styled.Title> */}

        {/* { ischatAllowed && !currentUser.presenter? 
          <Styled.PrivateChatButton
            //icon="chat"
            size="lg"
            
            ghost={isPublicChat ? true : false}
            color={isPublicChat ? "defult" : "primary"}
            // color="defult"
            onClick={() => {
              //this.handleClose();
              console.log('[chat] @edu14 open private chat presenterUser',presenterUser);
              getGroupChatPrivate(currentUser.userId, presenterUser);
              layoutContextDispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
                value: true,
              });
              layoutContextDispatch({
                type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
                value: PANELS.CHAT,
              });
              layoutContextDispatch({
                type: ACTIONS.SET_ID_CHAT_OPEN,
                value: presenterUser.userId,
              });
            }}
            aria-label={"Private"}//{intl.formatMessage(intlMessages.StartPrivateChat)}
            label={"Private"}//{intl.formatMessage(intlMessages.StartPrivateChat)}
            data-test="startPrivateChat"
          />
          
          : null 
        }, */}
        {
          !isPublicChat || !currentUser.presenter
            ? null
            // ? (
            //   <Button
            //     icon="close"
            //     size="sm"
                
            //     color="dark"
            //     hideLabel
            //     onClick={() => {
            //       actions.handleClosePrivateChat(chatID);
            //       layoutContextDispatch({
            //         type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
            //         value: false,
            //       });
            //       layoutContextDispatch({
            //         type: ACTIONS.SET_ID_CHAT_OPEN,
            //         value: '',
            //       });
            //       layoutContextDispatch({
            //         type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
            //         value: PANELS.NONE,
            //       });
            //     }}
            //     aria-label={intl.formatMessage(intlMessages.closeChatLabel, { 0: title })}
            //     label={"Public"}//{intl.formatMessage(intlMessages.closeChatLabel, { 0: title })}
            //     accessKey={CLOSE_CHAT_AK}
            //     data-test="closePrivateChat"
            //   />
            // )
            : (
              <ChatDropdownContainer {...{
                meetingIsBreakout, isMeteorConnected, amIModerator, timeWindowsValues,
              }}
              />
            )
        }
      </Styled.Header>
      <TimeWindowList
        id={ELEMENT_ID}
        chatId={chatID}
        handleScrollUpdate={actions.handleScrollUpdate}
        {...{
          partnerIsLoggedOut,
          lastReadMessageTime,
          hasUnreadMessages,
          scrollPosition,
          messages,
          currentUserIsModerator: amIModerator,
          timeWindowsValues,
          dispatch,
          count,
          syncing,
          syncedPercent,
          lastTimeWindowValuesBuild,
          userSentMessage,
        }}
      />
      <MessageFormContainer
        {...{
          title,
        }}
        chatId={chatID}
        chatTitle={title}
        chatAreaId={ELEMENT_ID}
        disabled={isChatLocked || !isMeteorConnected}
        connected={isMeteorConnected}
        locked={isChatLocked}
        partnerIsLoggedOut={partnerIsLoggedOut}
      />
    </Styled.Chat>
  );
};

export default memo(withShortcutHelper(injectWbResizeEvent(injectIntl(Chat)), ['hidePrivateChat', 'closePrivateChat']));

const propTypes = {
  chatID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  shortcuts: PropTypes.objectOf(PropTypes.string),
  partnerIsLoggedOut: PropTypes.bool.isRequired,
  isChatLocked: PropTypes.bool.isRequired,
  isMeteorConnected: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    handleClosePrivateChat: PropTypes.func.isRequired,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

const defaultProps = {
  shortcuts: [],
};

Chat.propTypes = propTypes;
Chat.defaultProps = defaultProps;
