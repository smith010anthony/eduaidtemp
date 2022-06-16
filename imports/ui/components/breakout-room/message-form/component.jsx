import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import deviceInfo from '/imports/utils/deviceInfo';
import PropTypes from 'prop-types';
import Styled from './styles';
import { notify } from '/imports/ui/services/notification';
import { isChatEnabled } from '/imports/ui/services/features';

const propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  chatId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  minMessageLength: PropTypes.number.isRequired,
  maxMessageLength: PropTypes.number.isRequired,
  chatTitle: PropTypes.string.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  UnsentMessagesCollection: PropTypes.objectOf(Object).isRequired,
  connected: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
};

const messages = defineMessages({
  submitLabel: {
    id: 'app.chat.submitLabel',
    description: 'Chat submit button label',
  },
  inputLabel: {
    id: 'app.chat.inputLabel',
    description: 'Chat message input label',
  },
  inputPlaceholder: {
    id: 'app.chat.inputPlaceholder',
    description: 'Chat message input placeholder',
  },
  errorMaxMessageLength: {
    id: 'app.chat.errorMaxMessageLength',
  },
  errorServerDisconnected: {
    id: 'app.chat.disconnected',
  },
  errorChatLocked: {
    id: 'app.chat.locked',
  },
  msgToBreakoutsSent: {
    id: 'app.createBreakoutRoom.msgToBreakoutsSent',
    description: 'Message for chat sent successfully',
  },
});

class MessageForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      error: null,
      hasErrors: false,
    };

    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageKeyDown = this.handleMessageKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setMessageHint = this.setMessageHint.bind(this);
  }

  componentDidMount() {
    const { isMobile } = deviceInfo;
    this.setMessageState();
    this.setMessageHint();

    if (!isMobile) {
      if (this.textarea) this.textarea.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      connected,
      locked,
      userMessagesTooAllBreakouts,
      intl,
    } = this.props;
    const { message } = this.state;

    // Check for new messages sent and notify user
    if (prevProps.userMessagesTooAllBreakouts.length < userMessagesTooAllBreakouts.length) {
      for (let i = prevProps.userMessagesTooAllBreakouts.length;
        i < userMessagesTooAllBreakouts.length;
        i += 1) {
        notify(
          intl.formatMessage(messages.msgToBreakoutsSent, { 0: userMessagesTooAllBreakouts[i].totalOfRooms }), 'info', 'group_chat',
        );
      }
    }

    this.updateUnsentMessagesCollection(prevProps.chatId, message);

    if (
      connected !== prevProps.connected
      || locked !== prevProps.locked
    ) {
      this.setMessageHint();
    }
  }

  componentWillUnmount() {
    const { chatId } = this.props;
    const { message } = this.state;
    this.updateUnsentMessagesCollection(chatId, message);
    this.setMessageState();
  }

  handleMessageKeyDown(e) {
    // TODO Prevent send message pressing enter on mobile and/or virtual keyboard
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();

      const event = new Event('submit', {
        bubbles: true,
        cancelable: true,
      });

      this.form.dispatchEvent(event);
    }
  }

  handleMessageChange(e) {
    const {
      intl,
      maxMessageLength,
    } = this.props;

    const message = e.target.value;
    let error = null;

    if (message.length > maxMessageLength) {
      error = intl.formatMessage(
        messages.errorMaxMessageLength,
        { 0: message.length - maxMessageLength },
      );
    }

    this.setState({
      message,
      error,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const {
      disabled,
      minMessageLength,
      maxMessageLength,
      handleSendMessage,
    } = this.props;
    const { message } = this.state;
    let msg = message.trim();

    if (msg.length < minMessageLength) return;

    if (disabled
        || msg.length > maxMessageLength) {
      this.setState({ hasErrors: true });
      return;
    }

    // Sanitize. See: http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/

    const div = document.createElement('div');
    div.appendChild(document.createTextNode(msg));
    msg = div.innerHTML;

    handleSendMessage(msg);
    this.setState({ message: '', hasErrors: false });
  }

  setMessageHint() {
    const {
      connected,
      disabled,
      intl,
      locked,
    } = this.props;

    let chatDisabledHint = null;

    if (disabled) {
      if (connected) {
        if (locked) {
          chatDisabledHint = messages.errorChatLocked;
        }
      } else {
        chatDisabledHint = messages.errorServerDisconnected;
      }
    }

    this.setState({
      hasErrors: disabled,
      error: chatDisabledHint ? intl.formatMessage(chatDisabledHint) : null,
    });
  }

  setMessageState() {
    const { chatId, UnsentMessagesCollection } = this.props;
    const unsentMessageByChat = UnsentMessagesCollection.findOne({ chatId },
      { fields: { message: 1 } });
    this.setState({ message: unsentMessageByChat ? unsentMessageByChat.message : '' });
  }

  updateUnsentMessagesCollection(chatId, message) {
    const { UnsentMessagesCollection } = this.props;
    UnsentMessagesCollection.upsert(
      { chatId },
      { $set: { message } },
    );
  }

  render() {
    const {
      intl,
      chatTitle,
      title,
      disabled,
    } = this.props;

    const { hasErrors, error, message } = this.state;

    return isChatEnabled() ? (
      <Styled.Form
        ref={(ref) => { this.form = ref; }}
        onSubmit={this.handleSubmit}
      >
        <Styled.Wrapper>
          <Styled.Input
            id="message-input"
            innerRef={(ref) => { this.textarea = ref; return this.textarea; }}
            placeholder={intl.formatMessage(messages.inputPlaceholder, { 0: title })}
            aria-label={intl.formatMessage(messages.inputLabel, { 0: chatTitle })}
            aria-invalid={hasErrors ? 'true' : 'false'}
            autoCorrect="off"
            autoComplete="off"
            spellCheck="true"
            disabled={disabled}
            value={message}
            onChange={this.handleMessageChange}
            onKeyDown={this.handleMessageKeyDown}
            async
          />
          <Styled.SendButton
            hideLabel
            circle
            aria-label={intl.formatMessage(messages.submitLabel)}
            type="submit"
            disabled={disabled}
            label={intl.formatMessage(messages.submitLabel)}
            color="primary"
            icon="send"
            onClick={() => { }}
            data-test="sendMessageButton"
          />
        </Styled.Wrapper>
        { error ? <Styled.ErrorMessage>{error}</Styled.ErrorMessage> : null }
      </Styled.Form>
    ) : null;
  }
}

MessageForm.propTypes = propTypes;

export default injectIntl(MessageForm);
