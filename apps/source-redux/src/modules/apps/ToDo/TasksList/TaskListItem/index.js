import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IntlMessages from '@crema/helpers/IntlMessages';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AppsStarredIcon from '@crema/components/AppsStarredIcon';
import { Avatar, Checkbox } from 'antd';
import AppIconButton from '@crema/components/AppIconButton';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdLabelOutline } from 'react-icons/md';
import {
  StyledTodoListCheckboxView,
  StyledTodoListImg,
  StyledTodoListImgView,
  StyledTodoListItem,
  StyledTodoListItemHide,
  StyledTodoListItemLeft,
  StyledTodoListStarView,
  StyledTodoListTitle,
  StyledTodoListItemRight,
  StyledTodoListRightContent,
  StyledTodoListStartDate,
  StyledTodoListItemAction,
} from '../index.styled';
import { TaskLabels, TaskPriority } from '@crema/modules/apps/ToDo';
import { useDispatch } from 'react-redux';
import { onUpdateSelectedTask } from '../../../../../redux/actions';

const TaskListItem = ({
  task,
  onChangeCheckedTasks,
  checkedTasks,
  onChangeStarred,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const { name } = useParams();
  const dispatch = useDispatch();

  const onViewTaskDetail = (task) => {
    navigate(`/apps/todo/${name}/${task.id}`);
  };

  const onDeleteTask = () => {
    task.folderValue = 126;
    dispatch(onUpdateSelectedTask(task));
  };

  return (
    <StyledTodoListItem
      key={task.id}
      className={clsx('item-hover', {
        checked: checkedTasks.includes(task.id),
      })}
      onClick={() => onViewTaskDetail(task)}
    >
      <StyledTodoListItemLeft>
        <StyledTodoListCheckboxView
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox
            checked={checkedTasks.includes(task.id)}
            onChange={() => {
              setIsChecked(!isChecked);
              onChangeCheckedTasks(!isChecked, task.id);
            }}
          />
        </StyledTodoListCheckboxView>

        <StyledTodoListImgView>
          <StyledTodoListStarView onClick={(event) => event.stopPropagation()}>
            <AppsStarredIcon item={task} onChange={onChangeStarred} />
          </StyledTodoListStarView>
          <StyledTodoListImg>
            <Avatar src={task?.assignedTo?.image} />
          </StyledTodoListImg>
        </StyledTodoListImgView>

        <StyledTodoListTitle className='text-truncate'>
          {task.title}
        </StyledTodoListTitle>

        {task.priority ? (
          <StyledTodoListItemHide>
            <TaskPriority priority={task.priority} />
          </StyledTodoListItemHide>
        ) : null}
      </StyledTodoListItemLeft>

      <StyledTodoListItemRight>
        {task.label ? <TaskLabels labels={task.label} /> : null}

        <StyledTodoListRightContent className='todo-list-item-right-content'>
          <StyledTodoListStartDate className='text-truncate'>
            <IntlMessages id='todo.scheduleFor' /> {task.startDate}
          </StyledTodoListStartDate>
        </StyledTodoListRightContent>

        <StyledTodoListItemAction className='todo-list-item-action'>
          <AppIconButton
            onClick={onDeleteTask}
            title={<IntlMessages id='common.delete' />}
            icon={<AiOutlineDelete />}
          />

          <AppIconButton
            title={<IntlMessages id='common.label' />}
            icon={<MdLabelOutline />}
          />
        </StyledTodoListItemAction>
      </StyledTodoListItemRight>
    </StyledTodoListItem>
  );
};

export default TaskListItem;

TaskListItem.defaultProps = {
  checkedTasks: [],
};

TaskListItem.propTypes = {
  task: PropTypes.object.isRequired,
  onChangeCheckedTasks: PropTypes.func,
  checkedTasks: PropTypes.array,
  onChangeStarred: PropTypes.func,
  onUpdateSelectedTask: PropTypes.func,
  match: PropTypes.object,
};
