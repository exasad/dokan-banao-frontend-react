import React, { useEffect, useState } from 'react';
import TaskSideBar from './TaskSideBar/index';
import TasksList from './TasksList';
import TaskDetail from './TaskDetail';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import AppsContainer from '@crema/components/AppsContainer';
import { useParams } from 'react-router-dom';
import AppPageMeta from '@crema/components/AppPageMeta';
import { useDispatch } from 'react-redux';
import {
  onGetToDoFolderList,
  onGetToDoLabelList,
  onGetToDoPriorityList,
  onGetToDoStaffList,
  onGetToDoStatusList,
} from '../../../toolkit/actions';

const ToDo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { messages } = useIntl();

  const [filterData, setFilterData] = useState({
    status: [],
    priority: [],
  });

  useEffect(() => {
    dispatch(onGetToDoLabelList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetToDoFolderList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetToDoPriorityList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetToDoStaffList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetToDoStatusList());
  }, [dispatch]);

  const onGetMainComponent = () => {
    if (id) {
      return <TaskDetail />;
    } else {
      return (
        <TasksList filterData={filterData} setFilterData={setFilterData} />
      );
    }
  };

  return (
    <AppsContainer
      title={messages['todo.todoApp']}
      sidebarContent={
        <TaskSideBar filterData={filterData} setFilterData={setFilterData} />
      }
    >
      <AppPageMeta title='Calendar App' />
      {onGetMainComponent()}
    </AppsContainer>
  );
};

export default ToDo;

ToDo.propTypes = {
  match: PropTypes.object,
};
