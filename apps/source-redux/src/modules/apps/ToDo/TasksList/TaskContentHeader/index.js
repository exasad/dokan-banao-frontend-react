import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import CheckedTasksActions from './CheckedTasksActions';
import { Checkbox } from 'antd';
import {
  StyledContentHeader,
  StyledTodoHeaderCheckboxView,
  StyledTodoHeaderPagination,
  StyledTodoSearch,
} from '../index.styled';
import {
  SelectTasksDropdown,
  ViewSelectButtons,
} from '@crema/modules/apps/ToDo';
import { useSelector } from 'react-redux';

const TaskContentHeader = (props) => {
  const {
    checkedTasks,
    setCheckedTasks,
    filterText,
    onSetFilterText,
    onChange,
    page,
    pageView,
    onChangePageView,
  } = props;
  const taskList = useSelector(({ todoApp }) => todoApp.taskList);

  const totalTasks = useSelector(({ todoApp }) => todoApp.totalTasks);

  const onHandleMasterCheckbox = (event) => {
    if (event.target.checked) {
      const taskIds = taskList.map((task) => task.id);
      setCheckedTasks(taskIds);
    } else {
      setCheckedTasks([]);
    }
  };

  const onSelectTasks = (value) => {
    switch (value) {
      case 0:
        setCheckedTasks(taskList.map((task) => task.id));
        break;
      case 1:
        setCheckedTasks([]);
        break;

      case 2:
        setCheckedTasks(
          taskList.filter((task) => task.isStarred).map((task) => task.id),
        );
        break;

      case 3:
        setCheckedTasks(
          taskList.filter((task) => task.hasAttachments).map((task) => task.id),
        );
        break;

      default:
        setCheckedTasks([]);
    }
  };

  const { messages } = useIntl();

  return (
    <>
      <StyledContentHeader>
        <StyledTodoHeaderCheckboxView>
          <Checkbox
            color='primary'
            indeterminate={
              checkedTasks?.length > 0 && checkedTasks?.length < taskList.length
            }
            checked={
              taskList?.length > 0 && checkedTasks.length === taskList?.length
            }
            onChange={onHandleMasterCheckbox}
          />
        </StyledTodoHeaderCheckboxView>

        <SelectTasksDropdown onSelectTasks={onSelectTasks} />

        <StyledTodoHeaderCheckboxView>
          {checkedTasks.length > 0 ? (
            <CheckedTasksActions
              checkedTasks={checkedTasks}
              setCheckedTasks={setCheckedTasks}
              page={page}
            />
          ) : null}
        </StyledTodoHeaderCheckboxView>

        <StyledTodoSearch
          placeholder={messages['common.searchHere']}
          value={filterText}
          onChange={(event) => onSetFilterText(event.target.value)}
        />
        <ViewSelectButtons
          pageView={pageView}
          onChangePageView={onChangePageView}
        />
      </StyledContentHeader>
      {pageView === 'list' && taskList.length > 0 ? (
        <StyledTodoHeaderPagination
          count={totalTasks}
          page={page}
          onChange={onChange}
        />
      ) : null}
    </>
  );
};

export default TaskContentHeader;

TaskContentHeader.defaultProps = {
  checkedTasks: [],
  filterText: '',
  page: 0,
};

TaskContentHeader.propTypes = {
  taskLists: PropTypes.array,
  checkedTasks: PropTypes.array,
  setCheckedTasks: PropTypes.func,
  filterText: PropTypes.string,
  onSetFilterText: PropTypes.func,
  page: PropTypes.number,
  onChange: PropTypes.func,
  pageView: PropTypes.string.isRequired,
  onChangePageView: PropTypes.func,
  onUpdateTasks: PropTypes.func,
  setData: PropTypes.func,
};
