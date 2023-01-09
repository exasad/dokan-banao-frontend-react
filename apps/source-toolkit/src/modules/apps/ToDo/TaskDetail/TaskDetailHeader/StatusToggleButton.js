import React from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import PropTypes from 'prop-types';
import { CheckOutlined } from '@ant-design/icons';
import { StyledTodoDetailStatusBtn } from '../index.styled';
import {
  onGetSelectedTask,
  onUpdateSelectedTask,
} from '../../../../../toolkit/actions';
import { useDispatch } from 'react-redux';

const StatusToggleButton = ({ id, selectedTask }) => {
  const dispatch = useDispatch();

  const onChangeTaskStatus = (status) => {
    dispatch(onUpdateSelectedTask({ ...selectedTask, status: status }));
    dispatch(onGetSelectedTask(id));
  };

  return selectedTask.status === 3 ? (
    <StyledTodoDetailStatusBtn
      className='bg-color'
      onClick={() => onChangeTaskStatus(1)}
    >
      <CheckOutlined className='check-icon' />
      <IntlMessages id='todo.completed' />
    </StyledTodoDetailStatusBtn>
  ) : (
    <StyledTodoDetailStatusBtn onClick={() => onChangeTaskStatus(3)}>
      <CheckOutlined className='check-icon' />
      <IntlMessages id='todo.markAsCompleted' />
    </StyledTodoDetailStatusBtn>
  );
};

export default StatusToggleButton;

StatusToggleButton.propTypes = {
  selectedTask: PropTypes.object.isRequired,
  onUpdateSelectedTask: PropTypes.func,
};
