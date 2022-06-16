import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withModalMounter } from '/imports/ui/components/common/modal/service';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import { defineMessages, injectIntl } from 'react-intl';
import Styled from './styles';
import RecordingIndicator from './recording-indicator/container';
import TalkingIndicatorContainer from '/imports/ui/components/nav-bar/talking-indicator/container';
import ConnectionStatusButton from '/imports/ui/components/connection-status/button/container';
import ConnectionStatusService from '/imports/ui/components/connection-status/service';
import SettingsDropdownContainer from './settings-dropdown/container';
import browserInfo from '/imports/utils/browserInfo';
import deviceInfo from '/imports/utils/deviceInfo';
import _ from "lodash";
import { politeSRAlert } from '/imports/utils/dom-utils';
import { PANELS, ACTIONS } from '../layout/enums';

const CHAT_CONFIG = Meteor.settings.public.chat;
const PUBLIC_CHAT_ID = CHAT_CONFIG.public_id;

const intlMessages = defineMessages({
  toggleUserListLabel: {
    id: 'app.navBar.userListToggleBtnLabel',
    description: 'Toggle button label',
  },
  toggleUserListAria: {
    id: 'app.navBar.toggleUserList.ariaLabel',
    description: 'description of the lists inside the userlist',
  },
  newMessages: {
    id: 'app.navBar.toggleUserList.newMessages',
    description: 'label for toggleUserList btn when showing red notification',
  },
  newMsgAria: {
    id: 'app.navBar.toggleUserList.newMsgAria',
    description: 'label for new message screen reader alert',
  },
  defaultBreakoutName: {
    id: 'app.createBreakoutRoom.room',
    description: 'default breakout room name',
  },
});

const propTypes = {
  presentationTitle: PropTypes.string,
  hasUnreadMessages: PropTypes.bool,
  shortcuts: PropTypes.string,
  breakoutNum: PropTypes.number,
  breakoutName: PropTypes.string,
  meetingName: PropTypes.string,
};

const defaultProps = {
  presentationTitle: 'Default Room Title',
  hasUnreadMessages: false,
  shortcuts: '',
};

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
        acs: props.activeChats,
    }

    this.handleToggleUserList = this.handleToggleUserList.bind(this);
    this.handleToggleChat = this.handleToggleChat.bind(this);

  }

  componentDidMount() {
    const {
      shortcuts: TOGGLE_USERLIST_AK,
      intl,
      breakoutNum,
      breakoutName,
      meetingName,
    } = this.props;

    if (breakoutNum && breakoutNum > 0) {
      if (breakoutName && meetingName) {
        const defaultBreakoutName = intl.formatMessage(intlMessages.defaultBreakoutName, {
          0: breakoutNum,
        });

        if (breakoutName === defaultBreakoutName) {
          document.title = `${breakoutNum} - ${meetingName}`;
        } else {
          document.title = `${breakoutName} - ${meetingName}`;
        }
      }
    }

    const { isFirefox } = browserInfo;
    const { isMacos } = deviceInfo;

    // accessKey U does not work on firefox for macOS for some unknown reason
    if (isMacos && isFirefox && TOGGLE_USERLIST_AK === 'U') {
      document.addEventListener('keyup', (event) => {
        const { key, code } = event;
        const eventKey = key?.toUpperCase();
        const eventCode = code;
        if (event?.altKey && (eventKey === TOGGLE_USERLIST_AK || eventCode === `Key${TOGGLE_USERLIST_AK}`)) {
          this.handleToggleUserList();
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.activeChats, this.props.activeChats)) {
      this.setState({ acs: this.props.activeChats})
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleToggleChat() {
    const {
      sidebarNavigation,
      sidebarContent,
      layoutContextDispatch,
    } = this.props;
    if (sidebarContent.isOpen) {
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
        value: false,
      });
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
        value: PANELS.NONE,
      });
      layoutContextDispatch({
        type: ACTIONS.SET_ID_CHAT_OPEN,
        value: '',
      });
    }
    else{
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
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
        value: false,
      });
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_PANEL,
        value: PANELS.NONE,
      });
    }

  }

  handleToggleUserList() {
    const {
      sidebarNavigation,
      sidebarContent,
      layoutContextDispatch,
    } = this.props;

    if (sidebarNavigation.isOpen) {
      if (sidebarContent.isOpen) {
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_IS_OPEN,
          value: false,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_SIDEBAR_CONTENT_PANEL,
          value: PANELS.NONE,
        });
        layoutContextDispatch({
          type: ACTIONS.SET_ID_CHAT_OPEN,
          value: '',
        });
      }

      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
        value: false,
      });
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_PANEL,
        value: PANELS.NONE,
      });
    } else {
      console.log('[nav-bar] @edu25 1111111')
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_IS_OPEN,
        value: true,
      });
      layoutContextDispatch({
        type: ACTIONS.SET_SIDEBAR_NAVIGATION_PANEL,
        value: PANELS.USERLIST,
      });
    }
  }

  render() {
    const {
      hasUnreadMessages,
      hasUnreadNotes,
      activeChats,
      intl,
      shortcuts: TOGGLE_USERLIST_AK,
      mountModal,
      presentationTitle,
      amIModerator,
      style,
      main,
      sidebarNavigation,
      amIPresenter
    } = this.props;

    const hasNotification = hasUnreadMessages || hasUnreadNotes;

    let ariaLabel = intl.formatMessage(intlMessages.toggleUserListAria);
    ariaLabel += hasNotification ? (` ${intl.formatMessage(intlMessages.newMessages)}`) : '';

    const isExpanded = sidebarNavigation.isOpen;

    const { acs } = this.state;

    activeChats.map((c, i) => {
      if (c?.unreadCounter > 0 && c?.unreadCounter !== acs[i]?.unreadCounter) {
        politeSRAlert(`${intl.formatMessage(intlMessages.newMsgAria, { 0: c.name })}`)
      }
    });

    return (
      <Styled.Navbar
        style={
          main === 'new'
            ? {
              position: 'absolute',
              top: style.top,
              left: style.left,
              height: style.height,
              width: style.width,
              zIndex:3,
            }
            : {
              position: 'relative',
              height: style.height,
              width: '100%',
              zIndex:3,
            }
        }
      >
        <Styled.Top>
          <Styled.Left>
            {/* {isExpanded && document.dir === 'ltr'
              && <Styled.ArrowLeft iconName="left_arrow" />}
            {!isExpanded && document.dir === 'rtl'
              && <Styled.ArrowLeft iconName="left_arrow" />} */}
            { amIModerator || amIPresenter ?
            <Styled.NavbarToggleButton
              //onClick={this.handleToggleUserList}
              onClick = {amIModerator ? this.handleToggleUserList : this.handleToggleChat}
              ghost
              //circle
              hideLabel
              data-test={hasNotification ? 'hasUnreadMessages' : 'toggleUserList'}
              label={intl.formatMessage(intlMessages.toggleUserListLabel)}
              tooltipLabel={intl.formatMessage(intlMessages.toggleUserListLabel)}
              aria-label={ariaLabel}
              icon={amIModerator ? "user" : "chat"}
              aria-expanded={isExpanded}
              accessKey={TOGGLE_USERLIST_AK}
              hasNotification={hasNotification}
            />
            : null }
            {/* {!isExpanded && document.dir === 'ltr'
              && <Styled.ArrowRight iconName="right_arrow" />}
            {isExpanded && document.dir === 'rtl'
              && <Styled.ArrowRight iconName="right_arrow" />} */}
          </Styled.Left>
          <Styled.Center>
            <Styled.PresentationTitle data-test="presentationTitle">
              {presentationTitle}
            </Styled.PresentationTitle>
            <RecordingIndicator
              mountModal={mountModal}
              amIModerator={amIModerator}
            />
          </Styled.Center>
          <Styled.Right>
            {ConnectionStatusService.isEnabled() ? <ConnectionStatusButton /> : null}
            <SettingsDropdownContainer amIModerator={amIModerator} />
          </Styled.Right>
        </Styled.Top>
        <Styled.Bottom>
          <TalkingIndicatorContainer amIModerator={amIModerator} />
        </Styled.Bottom>
      </Styled.Navbar>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;
export default withShortcutHelper(withModalMounter(injectIntl(NavBar)), 'toggleUserList');