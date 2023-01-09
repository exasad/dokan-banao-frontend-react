import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import AppsContainer from '@crema/components/AppsContainer';
import AppPageMeta from '@crema/components/AppPageMeta';
import { ChatSideBar } from '@crema/modules/apps/Chat';
import ChatContent from './ChatContent';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectionList, onSelectUser } from '../../../toolkit/actions';

const Chat = () => {
  const selectedUser = useSelector(({ chatApp }) => chatApp.selectedUser);
  const dispatch = useDispatch();
  const connectionList = useSelector(({ chatApp }) => chatApp.connectionList);
  const { loading } = useSelector(({ common }) => common);

  useEffect(() => {
    dispatch(getConnectionList());
  }, [dispatch]);

  const setSelectedUser = (item) => {
    dispatch(onSelectUser(item));
  };

  const { messages } = useIntl();
  return (
    <AppsContainer
      title={messages['chatApp.chat']}
      sidebarContent={
        <ChatSideBar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          connectionList={connectionList}
          loading={loading}
        />
      }
    >
      <AppPageMeta title='Chat App' />
      <ChatContent
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </AppsContainer>
  );
};

export default Chat;
