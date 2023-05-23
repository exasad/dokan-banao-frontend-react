import React, { useEffect } from 'react';
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailBody from './TaskDetailBody';
import { useParams } from 'react-router-dom';
import AppsHeader from '@crema/components/AppsHeader';
import AppsContent from '@crema/components/AppsContent';
import { MailDetailSkeleton } from '@crema/components/MailDetailSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { onGetSelectedCalTask } from '../../../../toolkit/actions';

const TaskDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetSelectedCalTask(id));
  }, [dispatch, id]);

  const selectedTask = useSelector(
    ({ calendarApp }) => calendarApp.selectedTask,
  );

  if (!selectedTask) {
    return <MailDetailSkeleton />;
  }
  return (
    <>
      <AppsHeader>
        <TaskDetailHeader selectedTask={selectedTask} />
      </AppsHeader>
      <AppsContent isDetailView>
        <TaskDetailBody selectedTask={selectedTask} />
      </AppsContent>
    </>
  );
};

export default TaskDetail;
