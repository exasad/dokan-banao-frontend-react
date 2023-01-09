import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/helpers/IntlMessages';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import {
  StyledMessageScreen,
  StyledMsgAppsFooter,
  StyledMsgScreenScrollbar,
  StyledNoMsg,
  StyledScrollChatNoMain,
} from '../index.styled';
import AppsHeader from '@crema/components/AppsHeader';
import { MessageType } from '@crema/fakedb/chat/connectionList';
import { AddNewMessage, Header, MessagesList } from '@crema/modules/apps/Chat';
import {
  getConnectionMessages,
  onClearChatHistory,
  onDeleteConversation,
  onDeleteMessage,
  onEditMessage,
  onSendMessage,
} from '../../../../../toolkit/actions';
import { useDispatch, useSelector } from 'react-redux';

const MessagesScreen = ({ selectedUser, setSelectedUser }) => {
  const [message, setMessage] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const userMessages = useSelector(({ chatApp }) => chatApp.userMessages);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const { user } = useAuthUser();

  let _scrollBarRef = useRef(null);
  useEffect(() => {
    dispatch(getConnectionMessages(selectedUser.channelId));
  }, [dispatch, selectedUser]);

  useEffect(() => {
    if (userMessages?.messageData?.length > 0) {
      if (_scrollBarRef?.current) {
        const scrollEl = _scrollBarRef.current.getScrollElement();
        scrollEl.scrollTop = scrollEl.scrollHeight;
      }
    }
  }, [userMessages, _scrollBarRef]);

  const sendFileMessage = (fileMessage) => {
    const data = {
      ...fileMessage,
      sender: user.id,
      time: moment().format('llll'),
    };
    dispatch(onSendMessage(selectedUser.channelId, data));
  };

  const onSend = (message) => {
    const data = {
      ...selectedMessage,
      message,
      message_type: MessageType.TEXT,
      sender: user.id,
      time: moment().format('llll'),
    };

    if (isEdit) {
      data.edited = true;
      dispatch(onEditMessage(selectedUser.channelId, data));
      setMessage('');
      setIsEdit(false);
      setSelectedMessage(null);
    } else {
      dispatch(onSendMessage(selectedUser.channelId, data));
      setMessage('');
    }
  };

  const onChangeStarred = (checked) => {
    setIsChecked(checked);
  };

  const onClickEditMessage = (data) => {
    if (data.message_type === MessageType.TEXT) {
      setIsEdit(true);
      setMessage(data.message);
      setSelectedMessage(data);
    }
  };

  const deleteMessage = (messageId) => {
    dispatch(onDeleteMessage(selectedUser.channelId, messageId));
  };

  const deleteConversation = () => {
    dispatch(onDeleteConversation(selectedUser.channelId));
  };
  const clearChatHistory = () => {
    dispatch(onClearChatHistory(selectedUser.channelId));
  };

  return (
    <StyledMessageScreen>
      <AppsHeader>
        <Header
          isChecked={isChecked}
          onChangeStarred={onChangeStarred}
          selectedUser={selectedUser}
          deleteConversation={deleteConversation}
          clearChatHistory={clearChatHistory}
        />
      </AppsHeader>

      {userMessages && user ? (
        <StyledMsgScreenScrollbar ref={_scrollBarRef}>
          <MessagesList
            userMessages={userMessages}
            authUser={user}
            selectedUser={selectedUser}
            onClickEditMessage={onClickEditMessage}
            deleteMessage={deleteMessage}
          />
        </StyledMsgScreenScrollbar>
      ) : (
        <StyledScrollChatNoMain>
          <StyledNoMsg>
            <IntlMessages id='chatApp.sayHi' /> {selectedUser.name}
          </StyledNoMsg>
        </StyledScrollChatNoMain>
      )}

      <StyledMsgAppsFooter>
        <AddNewMessage
          currentMessage={message}
          sendFileMessage={sendFileMessage}
          onSendMessage={onSend}
        />
      </StyledMsgAppsFooter>
    </StyledMessageScreen>
  );
};

export default MessagesScreen;

MessagesScreen.defaultProps = {};

MessagesScreen.propTypes = {
  selectedUser: PropTypes.object.isRequired,
  loading: PropTypes.any,
  setConnectionData: PropTypes.func,
  setSelectedUser: PropTypes.func,
};
