import React, { useEffect } from 'react';
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailBody from './TaskDetailBody';
import { useParams } from 'react-router-dom';
import AppsHeader from '@crema/components/AppsHeader';
import AppsContent from '@crema/components/AppsContent';
import { useDispatch, useSelector } from 'react-redux';
import { onGetSelectedTask } from '../../../../redux/actions';

const TaskDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetSelectedTask(id));
  }, [dispatch, id]);

  const selectedTask = useSelector(({ todoApp }) => todoApp.selectedTask);

  if (!selectedTask) {
    return null;
  }
  return (
    <>
      <AppsHeader>
        <TaskDetailHeader id={id} selectedTask={selectedTask} />
      </AppsHeader>
      <AppsContent isDetailView>
        <TaskDetailBody selectedTask={selectedTask} />
      </AppsContent>
    </>
  );
};

export default TaskDetail;
