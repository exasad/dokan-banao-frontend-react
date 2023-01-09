import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TaskContentHeader from './TaskContentHeader';
import TaskListItem from './TaskListItem';
import TaskCalender from './TaskCalendar';
import { useLocation } from 'react-router-dom';
import AddNewTask from '../AddNewTask';
import AppsPagination from '@crema/components/AppsPagination';
import AppsHeader from '@crema/components/AppsHeader';
import AppsContent from '@crema/components/AppsContent';
import ListEmptyResult from '@crema/components/AppList/ListEmptyResult';
import TodoListSkeleton from '@crema/components/TodoListSkeleton';
import AppList from '@crema/components/AppList';
import TaskListItemMobile from './TaskListItemMobile';
import {
  StyledTodoFooter,
  StyledTodoListDesktop,
  StyledTodoListMobile,
} from './index.styled';
import { putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/InfoViewContextProvider';

const TasksList = ({ taskLists, loading, setQueryParams, setData }) => {
  const infoViewActionsContext = useInfoViewActionsContext();

  const { pathname } = useLocation();

  const [{ apiData: labelList }] = useGetDataApi('/api/todo/labels/list', []);

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
    setQueryParams({
      type: path[path.length - 2],
      name: path[path.length - 1],
      page: page,
    });
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
    putDataApi('/api/todo/update/starred', infoViewActionsContext, {
      taskIds: [task.id],
      status: checked,
    })
      .then((data) => {
        onUpdateSelectedTask(data[0]);
        infoViewActionsContext.showMessage(
          data[0].isStarred
            ? 'Todo Marked as Starred Successfully'
            : 'Todo Marked as Unstarred Successfully',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  const onUpdateSelectedTask = (task) => {
    setData({
      data: taskLists?.data.map((item) => {
        if (item.id === task.id) {
          return task;
        }
        return item;
      }),
      count: taskLists?.count,
    });
  };

  const onDeleteSelectedTask = (task) => {
    setData({
      data: taskLists?.data.filter((item) => item.id !== task.id),
      count: taskLists?.count - 1,
    });
  };

  const onGetFilteredItems = () => {
    if (filterText === '') {
      return taskLists?.data;
    } else {
      return taskLists?.data.filter((task) =>
        task.title.toUpperCase().includes(filterText.toUpperCase()),
      );
    }
  };

  const onChangePageView = (view) => {
    setPageView(view);
  };
  const onUpdateTasks = (tasks) => {
    setData({
      data: taskLists?.data.map((item) => {
        const contact = tasks.find((contact) => contact.id === item.id);
        if (contact) {
          return contact;
        }
        return item;
      }),
      count: taskLists?.count,
    });
  };

  const list = onGetFilteredItems();
  return (
    <>
      <AppsHeader>
        <TaskContentHeader
          taskLists={taskLists?.data}
          checkedTasks={checkedTasks}
          setCheckedTasks={setCheckedTasks}
          filterText={filterText}
          onSetFilterText={onSetFilterText}
          onUpdateTasks={onUpdateTasks}
          setData={setData}
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
                    onUpdateSelectedTask={onDeleteSelectedTask}
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

      {taskLists?.data?.length > 0 ? (
        <StyledTodoFooter>
          <AppsPagination
            count={taskLists?.count}
            page={page}
            onChange={onChange}
          />
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
