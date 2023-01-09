import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TaskContentHeader from './TaskContentHeader';
import { useLocation } from 'react-router-dom';
import AddNewTask from '../AddNewTask';
import AppsPagination from '@crema/components/AppsPagination';
import AppsHeader from '@crema/components/AppsHeader';
import AppsContent from '@crema/components/AppsContent';
import ListEmptyResult from '@crema/components/AppList/ListEmptyResult';
import TodoListSkeleton from '@crema/components/TodoListSkeleton';
import AppList from '@crema/components/AppList';
import {
  StyledTodoFooter,
  StyledTodoListDesktop,
  StyledTodoListMobile,
} from './index.styled';
import { TaskCalender, TaskListItemMobile } from '@crema/modules/apps/ToDo';
import { useDispatch, useSelector } from 'react-redux';
import {
  onGetTaskList,
  onUpdateTaskStarredStatus,
} from '../../../../redux/actions';
import TaskListItem from './TaskListItem';

const TasksList = () => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const taskList = useSelector(({ todoApp }) => todoApp.taskList);

  const totalTasks = useSelector(({ todoApp }) => todoApp.totalTasks);

  const labelList = useSelector(({ todoApp }) => todoApp.labelList);

  const loading = useSelector(({ common }) => common.loading);

  const [filterText, onSetFilterText] = useState('');

  const [page, setPage] = useState(0);

  const [checkedTasks, setCheckedTasks] = useState([]);

  const [isAddTaskOpen, setAddTaskOpen] = React.useState(false);

  const [pageView, setPageView] = useState('list');

  useEffect(() => {
    setPage(0);
  }, [pathname]);

  useEffect(() => {
    const path = pathname.split('/');
    dispatch(onGetTaskList(path[path.length - 2], path[path.length - 1], page));
  }, [page, pageView, pathname]);

  const onOpenAddTask = () => {
    setAddTaskOpen(true);
  };

  const onCloseAddTask = () => {
    setAddTaskOpen(false);
  };

  const onChange = (page) => {
    setPage(page - 1);
  };

  const onChangeCheckedTasks = (checked, id) => {
    if (checked) {
      setCheckedTasks(checkedTasks.concat(id));
    } else {
      setCheckedTasks(checkedTasks.filter((taskId) => taskId !== id));
    }
  };

  const onChangeStarred = (checked, task) => {
    const status = checked;
    const selectedIdList = [task.id];
    const path = pathname.split('/');
    dispatch(
      onUpdateTaskStarredStatus(selectedIdList, status, path[path.length - 1]),
    );
  };

  const onGetFilteredItems = () => {
    if (filterText === '') {
      return taskList;
    } else {
      return taskList.filter((task) =>
        task.title.toUpperCase().includes(filterText.toUpperCase()),
      );
    }
  };

  const onChangePageView = (view) => {
    setPageView(view);
  };

  const list = onGetFilteredItems();
  return (
    <>
      <AppsHeader>
        <TaskContentHeader
          checkedTasks={checkedTasks}
          setCheckedTasks={setCheckedTasks}
          filterText={filterText}
          onSetFilterText={onSetFilterText}
          onChange={onChange}
          page={page}
          onChangePageView={onChangePageView}
          pageView={pageView}
        />
      </AppsHeader>
      <AppsContent>
        {pageView === 'list' ? (
          <>
            <StyledTodoListDesktop>
              <AppList
                data={list}
                renderItem={(task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    labelList={labelList}
                    onChangeCheckedTasks={onChangeCheckedTasks}
                    checkedTasks={checkedTasks}
                    onChangeStarred={onChangeStarred}
                  />
                )}
                ListEmptyComponent={
                  <ListEmptyResult
                    loading={loading}
                    actionTitle='Add Task'
                    onClick={onOpenAddTask}
                    placeholder={<TodoListSkeleton />}
                  />
                }
              />
            </StyledTodoListDesktop>
            <StyledTodoListMobile>
              <AppList
                data={list}
                renderItem={(task) => (
                  <TaskListItemMobile
                    key={task.id}
                    task={task}
                    labelList={labelList}
                    checkedTasks={checkedTasks}
                    onChangeStarred={onChangeStarred}
                    onChangeCheckedTasks={onChangeCheckedTasks}
                  />
                )}
                ListEmptyComponent={
                  <ListEmptyResult
                    loading={loading}
                    actionTitle='Add Task'
                    onClick={onOpenAddTask}
                    placeholder={<TodoListSkeleton />}
                  />
                }
              />
            </StyledTodoListMobile>
          </>
        ) : (
          <TaskCalender taskList={list} />
        )}
      </AppsContent>

      {taskList.length > 0 ? (
        <StyledTodoFooter>
          <AppsPagination count={totalTasks} page={page} onChange={onChange} />
        </StyledTodoFooter>
      ) : null}

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

TasksList.propTypes = {
  taskLists: PropTypes.object,
  loading: PropTypes.bool,
  setQueryParams: PropTypes.func,
  setData: PropTypes.func,
};
