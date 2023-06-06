import React from 'react';
import { Select } from 'antd';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { StyledTodoSelectBox } from '../index.styled';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateSelectedCalTask } from '../../../../../toolkit/actions';

const TaskStatus = ({ selectedTask }) => {
  const statusList = useSelector(({ calendarApp }) => calendarApp.statusList);

  const dispatch = useDispatch();

  const onChangeStatus = (value) => {
    dispatch(onUpdateSelectedCalTask({ ...selectedTask, status: value }));
  };
  const { messages } = useIntl();

  return (
    <StyledTodoSelectBox
      onChange={(value) => onChangeStatus(value)}
      value={selectedTask?.status}
      placeholder={messages['common.status']}
    >
      {statusList.map((status) => {
        return (
          <Select.Option key={status.type} value={status.id}>
            {status.name}
          </Select.Option>
        );
      })}
    </StyledTodoSelectBox>
  );
};

export default TaskStatus;

TaskStatus.propTypes = {
  selectedTask: PropTypes.object.isRequired,
  onUpdateSelectedTask: PropTypes.func,
};
