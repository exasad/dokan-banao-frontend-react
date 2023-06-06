import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { onUpdateSelectedCalTask } from '../../../../../redux/actions';
import { useAuthUser } from '@crema/hooks/AuthHooks';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ChangeStaff from './ChangeStaff';
import TaskStatus from './TaskStatus';
import TaskPriority from './TaskPriority';
import { Input } from 'antd';
import { FiSend } from 'react-icons/fi';
import { AiOutlineCheckCircle, AiOutlineEdit } from 'react-icons/ai';
import AppIconButton from '@crema/components/AppIconButton';
import {
  StyledDetailContent,
  StyledTodoDetailBtn,
  StyledTodoDetailContentHeader,
  StyledTodoDetailContentHeaderLabel,
  StyledTodoDetailContentHeaderLeft,
  StyledTodoDetailContentHeaderTag,
  StyledTodoDetailContentHeaderTagBtn,
  StyledTodoDetailFooter,
  StyledTodoDetailPara,
  StyledTodoDetailStaff,
  StyledTodoDetailStaffEdit,
  StyledTodoDetailStaffEditBtnView,
  StyledTodoDetailStaffRow,
  StyledTodoDetailStatus,
  StyledTodoDetailStatusPri,
  StyledTodoDetailTextAreaForm,
  StyledTodoDivider,
} from '../index.styled';
import {
  CommentsLists,
  AssignedStaff,
  TodoDatePicker,
  TaskCreatedByInfo,
  TaskLabels,
} from '@crema/modules/apps/Calendar';
import { useDispatch, useSelector } from 'react-redux';
import { getDateObject, getFormattedDate } from '@crema/helpers';

const TaskDetailBody = (props) => {
  const { selectedTask } = props;
  const dispatch = useDispatch();
  const { user } = useAuthUser();

  const [isEdit, setEdit] = useState(false);
  const [title, setTitle] = useState(selectedTask.title);
  const [content, setContent] = useState(selectedTask.content);
  const [comment, setComment] = useState('');

  const staffList = useSelector(({ calendarApp }) => calendarApp.staffList);

  const [scheduleDate, setScheduleDate] = useState(
    getDateObject(selectedTask.startDate),
  );
  const [scheduleEndDate, setScheduleEndDate] = useState(
    getDateObject(selectedTask.endDate),
  );

  const [selectedStaff, setStaff] = useState(selectedTask.assignedTo);

  const inputLabel = React.useRef(null);

  const [labelWidth, setLabelWidth] = React.useState(0);

  useEffect(() => {
    setLabelWidth(60);
  }, []);

  const onClickEditButton = () => {
    setEdit(true);
  };

  const onDoneEditing = () => {
    dispatch(
      onUpdateSelectedCalTask({
        ...selectedTask,
        content,
        startDate: getFormattedDate(scheduleDate),
        endDate: getFormattedDate(scheduleEndDate),
        assignedTo: selectedStaff,
      }),
    );
    setEdit(!isEdit);
  };

  const onAddComments = () => {
    let task = selectedTask;
    const comments = task.comments.concat({
      comment: comment,
      name: user.displayName ? user.displayName : 'User',
      image: user.photoURL,
      date: dayjs().format('ll'),
    });
    dispatch(onUpdateSelectedCalTask({ ...selectedTask, comments }));
    setComment('');
  };

  const handleStaffChange = (value) => {
    const newStaff = staffList.find((staff) => staff.id === value);
    setStaff((staff) => {
      return { ...staff, ...newStaff };
    });
  };

  const { messages } = useIntl();

  return (
    <StyledDetailContent>
      <StyledTodoDetailContentHeader>
        <StyledTodoDetailContentHeaderLeft>
          {isEdit ? (
            <Input
              style={{ maxWidth: 200, marginRight: 20 }}
              placeholder={messages['todo.taskTitle']}
              defaultValue={title}
              onChange={({ target: { value } }) => setTitle(value)}
            />
          ) : (
            <h2>{selectedTask.title}</h2>
          )}

          <StyledTodoDetailContentHeaderLabel className='ant-row ant-row-middle'>
            {selectedTask.label ? (
              <TaskLabels labels={selectedTask.label} />
            ) : null}
          </StyledTodoDetailContentHeaderLabel>

          <StyledTodoDetailContentHeaderTag>
            <StyledTodoDetailContentHeaderTagBtn
              style={{
                color: selectedTask.priority.color,
                backgroundColor: selectedTask.priority.color + '10',
              }}
            >
              {selectedTask.priority.name}
            </StyledTodoDetailContentHeaderTagBtn>
          </StyledTodoDetailContentHeaderTag>
        </StyledTodoDetailContentHeaderLeft>

        <TaskCreatedByInfo
          createdBy={selectedTask.createdBy}
          createdOn={selectedTask.createdOn}
        />
      </StyledTodoDetailContentHeader>

      <StyledTodoDetailStaffEdit>
        <StyledTodoDetailStaffRow>
          {isEdit ? (
            <>
              <StyledTodoDetailStaff>
                <ChangeStaff
                  inputLabel={inputLabel}
                  labelWidth={labelWidth}
                  selectedStaff={selectedStaff}
                  handleStaffChange={handleStaffChange}
                />
              </StyledTodoDetailStaff>
              <TodoDatePicker
                scheduleDate={scheduleDate}
                scheduleEndDate={scheduleEndDate}
                setScheduleDate={setScheduleDate}
                setScheduleEndDate={setScheduleEndDate}
              />
            </>
          ) : (
            <AssignedStaff assignedStaff={selectedTask.assignedTo} />
          )}
        </StyledTodoDetailStaffRow>

        <StyledTodoDetailStaffEditBtnView>
          {!isEdit ? (
            <AppIconButton
              onClick={onClickEditButton}
              icon={<AiOutlineEdit />}
            />
          ) : (
            <AppIconButton
              onClick={onDoneEditing}
              icon={<AiOutlineCheckCircle />}
            />
          )}
        </StyledTodoDetailStaffEditBtnView>
      </StyledTodoDetailStaffEdit>

      <StyledTodoDivider />

      {!isEdit ? (
        <StyledTodoDetailPara>{content}</StyledTodoDetailPara>
      ) : (
        <StyledTodoDetailTextAreaForm>
          <Input.TextArea
            placeholder={messages['common.description']}
            defaultValue={content}
            onChange={({ target: { value } }) => setContent(value)}
          />
        </StyledTodoDetailTextAreaForm>
      )}

      <StyledTodoDetailStatusPri>
        <StyledTodoDetailStatus>
          <TaskStatus selectedTask={selectedTask} />
        </StyledTodoDetailStatus>

        <StyledTodoDetailStatus>
          <TaskPriority selectedTask={selectedTask} />
        </StyledTodoDetailStatus>
      </StyledTodoDetailStatusPri>

      <StyledTodoDivider />

      <CommentsLists comments={selectedTask.comments} />

      <StyledTodoDetailFooter>
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 3 }}
          placeholder={messages['common.writeComment']}
          value={comment}
          onChange={({ target: { value } }) => setComment(value)}
        />
        <StyledTodoDetailBtn
          shape='circle'
          type='primary'
          disabled={!comment}
          onClick={onAddComments}
        >
          <FiSend />
        </StyledTodoDetailBtn>
      </StyledTodoDetailFooter>
    </StyledDetailContent>
  );
};

export default TaskDetailBody;

TaskDetailBody.propTypes = {
  selectedTask: PropTypes.object.isRequired,
  onUpdateSelectedTask: PropTypes.func,
};
