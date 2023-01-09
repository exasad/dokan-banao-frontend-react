import React from 'react';
import { Select } from 'antd';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { onUpdateSelectedTask } from '../../../../../toolkit/actions';
import { useDispatch, useSelector } from 'react-redux';

const TaskLabel = ({ selectedTask }) => {
  const dispatch = useDispatch();
  const labelList = useSelector(({ todoApp }) => todoApp.labelList);

  const onChangePriority = (value) => {
    const label = labelList.filter((label) => value.includes(label.id));
    dispatch(onUpdateSelectedTask({ ...selectedTask, label }));
  };

  const { messages } = useIntl();
  return (
    <Select
      placeholder={messages['common.label']}
      maxTagCount={2}
      style={{ minWidth: 100 }}
      mode='multiple'
      defaultValue={selectedTask?.label.map((label) => label.id)}
      onChange={onChangePriority}
    >
      {labelList.map((label) => {
        return (
          <Select.Option value={label.id} key={label.id}>
            {label.name}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default TaskLabel;

TaskLabel.propTypes = {
  selectedTask: PropTypes.object.isRequired,
  onUpdateSelectedTask: PropTypes.func,
};
