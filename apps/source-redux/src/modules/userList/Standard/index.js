import React, { useEffect } from 'react';
import { ListItem } from '@crema/modules/userList/Standard';

import AppList from '@crema/components/AppList';
import AppInfoView from '@crema/components/AppInfoView';
import { StyledUserStandard } from './index.styled';
import { useDispatch, useSelector } from 'react-redux';
import { onGetUserList } from '../../../redux/actions';

const Standard = () => {
  const dispatch = useDispatch();

  const usersList = useSelector(({ userList }) => userList.usersList);

  useEffect(() => {
    dispatch(onGetUserList());
  }, [dispatch]);

  return (
    <StyledUserStandard>
      {usersList ? (
        <AppList
          interval={120}
          data={usersList}
          renderItem={(user) => {
            return <ListItem user={user} key={user.id} />;
          }}
        />
      ) : null}
      <AppInfoView />
    </StyledUserStandard>
  );
};

export default Standard;
