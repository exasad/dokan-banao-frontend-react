import React, { useEffect, useState } from 'react';
import AddNewTask from '../AddNewTask';
import AppsContent from '@crema/components/AppsContent';
import { TaskCalender } from '@crema/modules/apps/Calendar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  onGetCalPriorityList,
  onGetCalStatusList,
  onGetCalTaskList,
  onUpdateSelectedCalTask,
} from '../../../../toolkit/actions';

const TasksList = ({ filterData }) => {
  const dispatch = useDispatch();
  const { folder, label } = useParams();

  const [page, setPage] = useState(0);
  const [filterText, onSetFilterText] = useState('');
  const [isAddTaskOpen, setAddTaskOpen] = React.useState(false);

  const taskList = useSelector(({ calendarApp }) => calendarApp.taskList);

  const onCloseAddTask = () => {
    setAddTaskOpen(false);
  };

  const getFilterData = () => {
    if (taskList) {
      const data = taskList.filter((task) => {
        let status = true;
        if (filterData.status.length > 0) {
          status = filterData.status.includes(task.status);
        }
        let priority = true;
        if (filterData.priority.length > 0) {
          priority = filterData.priority.includes(task.priority.id);
        }
        return status && priority;
      });
      return {
        data,
        count: data.length,
      };
    }
    return [];
  };

  useEffect(() => {
    setPage(0);
    dispatch(onGetCalPriorityList());
    dispatch(onGetCalStatusList());
    if (folder) dispatch(onGetCalTaskList('folder', folder, page));
    if (label) dispatch(onGetCalTaskList('label', label, page));
  }, [dispatch, page, folder, label]);

  const onGetFilteredItems = () => {
    if (!taskList) return [];
    if (filterText === '') {
      return getFilterData().data;
    } else {
      return getFilterData().data.filter((task) =>
        task.title.toUpperCase().includes(filterText.toUpperCase()),
      );
    }
  };

  const onUpdateTask = (task) => {
    dispatch(onUpdateSelectedCalTask(task));
  };

  const list = onGetFilteredItems();

  return (
    <>
      <AppsContent fullView>
        <TaskCalender
          taskList={list}
          onUpdateTask={onUpdateTask}
          onSetFilterText={onSetFilterText}
        />
      </AppsContent>

      {isAddTaskOpen ? (
        <AddNewTask
          isAddTaskOpen={isAddTaskOpen}
          onCloseAddTask={onCloseAddTask}
        />
      ) : null}
    </>
  );
};

export default TasksList;
