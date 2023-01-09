import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IntlMessages from '@crema/helpers/IntlMessages';
import PropTypes from 'prop-types';
import AppsStarredIcon from '@crema/components/AppsStarredIcon';
import StatusToggleButton from './StatusToggleButton';
import { BiArrowBack } from 'react-icons/bi';
import {
  StyledTodoDetailArrow,
  StyledTodoDetailDeleteIcon,
  StyledTodoStarIconView,
} from '../index.styled';
import { useDispatch } from 'react-redux';
import {
  onGetSelectedTask,
  onUpdateSelectedTask,
} from '../../../../../redux/actions';

const TaskDetailHeader = (props) => {
  const { id, selectedTask } = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onClickBackButton = () => {
    navigate(-1);
  };

  const onChangeStarred = (checked) => {
    const task = selectedTask;
    task.isStarred = checked;
    dispatch(onUpdateSelectedTask(task));
    dispatch(onGetSelectedTask(id));
  };

  const onDeleteTask = () => {
    const task = selectedTask;
    task.folderValue = 126;
    dispatch(onUpdateSelectedTask(task));
    navigate(-1);
  };

  return (
    <>
      <StyledTodoDetailArrow
        title={<IntlMessages id='common.back' />}
        onClick={onClickBackButton}
        icon={<BiArrowBack />}
      />

      <StatusToggleButton id={id} selectedTask={selectedTask} />

      <StyledTodoStarIconView>
        <AppsStarredIcon item={selectedTask} onChange={onChangeStarred} />
      </StyledTodoStarIconView>

      <StyledTodoDetailDeleteIcon
        deleteAction={onDeleteTask}
        deleteTitle={<IntlMessages id='todo.deleteMessage' />}
      />
    </>
  );
};

export default TaskDetailHeader;

TaskDetailHeader.propTypes = {
  selectedTask: PropTypes.object.isRequired,
};
