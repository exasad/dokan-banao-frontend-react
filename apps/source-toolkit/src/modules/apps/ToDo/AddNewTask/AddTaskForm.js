import React from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Col, Form, Input, Select } from 'antd';
import AppRowContainer from '@crema/components/AppRowContainer';
import moment from 'moment';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import {
  StyledAddTaskFormDate,
  StyledSelectRow,
  StyledTodoAddTaskForm,
  StyledTodoInput,
  StyledTodoModalFooter,
  StyledTodoModelBtn,
  StyledTodoModelContent,
  StyledTodoSelectAvatar,
  StyledTodoSelectName,
} from './index.styled';
import { useDispatch, useSelector } from 'react-redux';
import { onCreateTask } from '../../../../toolkit/actions';

const AddTaskForm = ({ onCloseAddTask, selectedDate }) => {
  const dispatch = useDispatch();
  const labelList = useSelector(({ todoApp }) => todoApp.labelList);

  const priorityList = useSelector(({ todoApp }) => todoApp.priorityList);

  const staffList = useSelector(({ todoApp }) => todoApp.staffList);

  const { user } = useAuthUser();

  const onFinish = (values) => {
    const staff = staffList.find((staff) => staff.id === +values.staffList);

    const priority = priorityList.find(
      (label) => +values.priorityList === label.id,
    );
    const label = labelList.filter((label) => +values.labelList === label.id);

    const newTask = {
      ...values,
      id: Math.floor(Math.random() * 1000000),
      isStarred: false,
      hasAttachments: false,
      sentAt: '10.30am',
      isRead: true,
      folderValue: 120,
      createdBy: {
        name: user.displayName ? user.displayName : 'user',
        image: user.photoURL ? user.photoURL : '/assets/images/dummy2.jpg',
      },
      scheduleDate: moment(values.scheduleDate).format('lll'),
      assignedTo: staff,
      createdOn: moment().format('ll'),
      status: 1,
      comments: [],
      label: label,
      priority: priority,
    };
    console.log(newTask);
    dispatch(onCreateTask(newTask));
    onCloseAddTask();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    onCloseAddTask(true);
  };

  const { messages } = useIntl();

  const { Option } = Select;

  return (
    <StyledTodoAddTaskForm
      name='basic'
      initialValues={{
        scheduleDate: selectedDate ? moment(selectedDate, 'YYYY-MM-DD') : '',
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <StyledTodoModelContent>
        <Form.Item
          className='form-field'
          name='title'
          rules={[{ required: true, message: 'Please input your Task Title!' }]}
        >
          <StyledTodoInput placeholder={messages['todo.taskTitle']} />
        </Form.Item>

        <AppRowContainer>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name='staffList' className='form-field'>
              <Select placeholder={messages['common.staff']}>
                {staffList.map((staff) => {
                  return (
                    <Option value={staff.id} key={staff.id}>
                      <StyledSelectRow>
                        {staff.image ? (
                          <StyledTodoSelectAvatar src={staff.image} />
                        ) : (
                          <StyledTodoSelectAvatar>
                            {staff.name.toUpperCase()}
                          </StyledTodoSelectAvatar>
                        )}
                        <StyledTodoSelectName className='text-truncate'>
                          {staff.name}
                        </StyledTodoSelectName>
                      </StyledSelectRow>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item className='form-field' name='scheduleDate'>
              <StyledAddTaskFormDate />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item className='form-field' name='priorityList'>
              <Select placeholder={messages['common.priority']}>
                {priorityList.map((priority) => {
                  return (
                    <Option value={priority.id} key={priority.id}>
                      {priority.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Form.Item className='form-field' name='labelList'>
              <Select
                placeholder={messages['common.label']}
                mode='multiple'
                maxTagCount={2}
              >
                {labelList.map((label) => {
                  return (
                    <Option value={label.id} key={label.id}>
                      {label.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </AppRowContainer>

        <Form.Item className='form-field' name='description'>
          <Input.TextArea
            placeholder={messages['common.description']}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
      </StyledTodoModelContent>

      <StyledTodoModalFooter>
        <StyledTodoModelBtn type='primary' htmlType='submit'>
          <IntlMessages id='common.save' />
        </StyledTodoModelBtn>
      </StyledTodoModalFooter>
    </StyledTodoAddTaskForm>
  );
};

export default AddTaskForm;

AddTaskForm.propTypes = {
  setFieldValue: PropTypes.func,
  reCallAPI: PropTypes.func,
  isSubmitting: PropTypes.bool,
  onCloseAddTask: PropTypes.func,
  selectedDate: PropTypes.any,
};
