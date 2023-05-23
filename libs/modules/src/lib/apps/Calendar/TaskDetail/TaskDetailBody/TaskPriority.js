import React from 'react';
import { Select } from 'antd';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { StyledTodoSelectBox } from '../index.styled';
import { putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/InfoViewContextProvider';

const TaskPriority = ({ selectedTask, onUpdateSelectedTask }) => {
  const infoViewActionsContext = useInfoViewActionsContext();
  const [{ apiData: priorityList }] = useGetDataApi(
    '/api/todo/priority/list',
    [],
  );

  const onChangePriority = (value) => {
    selectedTask.priority = priorityList.find(
      (priority) => priority.type === value,
    );
    putDataApi('/api/todoApp/task/', infoViewActionsContext, {
      task: selectedTask,
    })
      .then((data) => {
        onUpdateSelectedTask(data[0]);
        infoViewActionsContext.showMessage('Task Updated Successfully');
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
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
