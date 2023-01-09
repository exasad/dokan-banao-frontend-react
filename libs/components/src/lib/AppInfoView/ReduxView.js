import AppLoader from '../AppLoader';
import { HIDE_MESSAGE } from '@crema/constants';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { message } from 'antd';

const AppInfoViewRedux = () => {
  const { error, loading, displayMessage } = useSelector(
    ({ common }) => common,
  );

  const dispatch = useDispatch();
  const clearInfoView = () => {
    dispatch(dispatch({ type: HIDE_MESSAGE }));
  };

  useEffect(() => {
    if (error) {
      message.error(error);
      clearInfoView();
    }
  }, [error]);

  useEffect(() => {
    if (displayMessage) {
      message.success(displayMessage);
      clearInfoView();
    }
  }, [displayMessage]);

  return loading ? <AppLoader /> : null;
};

export default AppInfoViewRedux;
