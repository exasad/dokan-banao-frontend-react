import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '../../../../../toolkit/actions';

const TaskDetailHeader = (props) => {
  const { id, selectedTask } = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onClickBackButton = () => {
    navigate(-1);
  };

  const onChangeStarred = (checked) => {
    dispatch(onUpdateSelectedTask({ ...selectedTask, isStarred: checked }));
    dispatch(onGetSelectedTask(id));
  };

  const onDeleteTask = () => {
    dispatch(onUpdateSelectedTask({ ...selectedTask, folderValue: 126 }));
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
