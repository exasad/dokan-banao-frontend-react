import React, { useEffect } from 'react';
import AppInfoView from '@crema/components/AppInfoView';
import { StyledUserFlat } from './index.styled';
import AppList from '@crema/components/AppList';
import { ListItem } from '@crema/modules/userList/Flat';
import { useDispatch, useSelector } from 'react-redux';
import { onGetUserList } from '../../../redux/actions';

const Flat = () => {
  const dispatch = useDispatch();

  const usersList = useSelector(({ userList }) => userList.usersList);

  useEffect(() => {
    dispatch(onGetUserList());
  }, [dispatch]);

  return (
    <StyledUserFlat>
      {usersList ? (
        <AppList
          type='top'
          interval={120}
          data={usersList}
          renderItem={(user) => {
            return <ListItem user={user} key={user.id} />;
          }}
        />
      ) : null}
      <AppInfoView />
    </StyledUserFlat>
  );
};

export default Flat;
