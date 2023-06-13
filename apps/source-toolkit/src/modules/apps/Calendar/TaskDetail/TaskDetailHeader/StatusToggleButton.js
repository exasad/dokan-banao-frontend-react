import React from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import PropTypes from 'prop-types';
import { CheckOutlined } from '@ant-design/icons';
import { StyledTodoDetailStatusBtn } from '../index.styled';
import { useDispatch } from 'react-redux';
import { onUpdateSelectedCalTask } from '../../../../../toolkit/actions';

const StatusToggleButton = ({ selectedTask }) => {
  const dispatch = useDispatch();

  const onChangeTaskStatus = (status) => {
    dispatch(onUpdateSelectedCalTask({ ...selectedTask, status }));
  };

  return (
    <>
      {selectedTask.status === 1003 ? (
        <StyledTodoDetailStatusBtn
          className='bg-color'
          onClick={() => onChangeTaskStatus(1001)}
        >
          <CheckOutlined className='check-icon' />
          <IntlMessages id='todo.completed' />
        </StyledTodoDetailStatusBtn>
      ) : (
        <StyledTodoDetailStatusBtn onClick={() => onChangeTaskStatus(3)}>
          <CheckOutlined className='check-icon' />
          <IntlMessages id='todo.markAsCompleted' />
        </StyledTodoDetailStatusBtn>
      )}
    </>
  );
};

export default StatusToggleButton;

StatusToggleButton.propTypes = {
  selectedTask: PropTypes.object.isRequired,
  onUpdateSelectedTask: PropTypes.func,
};
