import React, { useEffect } from 'react';
import TaskSideBar from './TaskSideBar/index';
import TasksList from './TasksList';
import TaskDetail from './TaskDetail';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import AppsContainer from '@crema/components/AppsContainer';
import AppPageMeta from '@crema/components/AppPageMeta';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  onGetToDoFolderList,
  onGetToDoLabelList,
  onGetToDoPriorityList,
  onGetToDoStaffList,
  onGetToDoStatusList,
} from '../../../toolkit/actions';

const ToDo = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

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
      return <TasksList />;
    }
  };

  const { messages } = useIntl();
  return (
    <AppsContainer
      title={messages['todo.todoApp']}
      sidebarContent={<TaskSideBar />}
    >
      <AppPageMeta title='Todo App' />
      {onGetMainComponent()}
    </AppsContainer>
  );
};

export default ToDo;

ToDo.defaultProps = {
  match: null,
};

ToDo.propTypes = {
  match: PropTypes.object,
};
