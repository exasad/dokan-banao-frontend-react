import React from 'react';
import { Select } from 'antd';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { StyledTodoSelectBox } from '../index.styled';
import { useDispatch, useSelector } from 'react-redux';
import { onUpdateSelectedTask } from '../../../../../toolkit/actions';

const TaskPriority = ({ selectedTask }) => {
  const dispatch = useDispatch();
  const priorityList = useSelector(({ todoApp }) => todoApp.priorityList);

  const onChangePriority = (value) => {
    const priority = priorityList.find((priority) => priority.type === value);
    dispatch(onUpdateSelectedTask({ ...selectedTask, priority }));
  };

  const { messages } = useIntl();
  return (
    <StyledTodoSelectBox
      defaultValue={selectedTask?.priority?.type}
      placeholder={messages['common.priority']}
      onChange={(value) => onChangePriority(value)}
    >
      {priorityList.map((priority) => {
        return (
          <Select.Option key={priority.id} value={priority.type}>
            {priority.name}
          </Select.Option>
        );
      })}
    </StyledTodoSelectBox>
  );
};

export default TaskPriority;

TaskPriority.propTypes = {
  selectedTask: PropTypes.object.isRequired,
  onUpdateSelectedTask: PropTypes.func,
};
