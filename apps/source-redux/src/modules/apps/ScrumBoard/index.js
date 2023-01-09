import React, { useEffect } from 'react';
import BoardDetail from './BoardDetail';
import BoardList from './BoardList';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onGetMemberList, onGetScrumLabelList } from '../../../redux/actions';

const ScrumBoard = () => {
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetScrumLabelList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetMemberList());
  }, [dispatch]);

  const onGetMainComponent = () => {
    if (params.id) {
      return <BoardDetail />;
    } else {
      return <BoardList />;
    }
  };

  return <>{onGetMainComponent()}</>;
};

export default ScrumBoard;
