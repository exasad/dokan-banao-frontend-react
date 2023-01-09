import React from 'react';
import { Select } from 'antd';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { StyledTodoSelectBox } from '../index.styled';
import { useSelector, useDispatch } from 'react-redux';
import { onUpdateSelectedTask } from '../../../../../toolkit/actions';

const TaskStatus = ({ selectedTask }) => {
  const statusList = useSelector(({ todoApp }) => todoApp.statusList);

  const dispatch = useDispatch();

  const onChangeStatus = (value) => {
    dispatch(onUpdateSelectedTask({ ...selectedTask, status: value }));
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
          <Select.Option key={status.type} value={status.type}>
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
