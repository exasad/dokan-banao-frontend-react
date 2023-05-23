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
import { onUpdateSelectedCalTask } from '../../../../../toolkit/actions';

const TaskDetailHeader = (props) => {
  const { selectedTask } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickBackButton = () => {
    navigate(-1);
  };

  const onChangeStarred = (checked) => {
    dispatch(onUpdateSelectedCalTask({ ...selectedTask, isStarred: checked }));
  };

  const onDeleteTask = () => {
    dispatch(onUpdateSelectedCalTask({ ...selectedTask, folderValue: 126 }));
    navigate(-1);
  };

  return (
    <>
      <StyledTodoDetailArrow
        title={<IntlMessages id='common.back' />}
        onClick={onClickBackButton}
        icon={<BiArrowBack />}
      />

      <StatusToggleButton selectedTask={selectedTask} />

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
  onUpdateSelectedTask: PropTypes.func,
};
