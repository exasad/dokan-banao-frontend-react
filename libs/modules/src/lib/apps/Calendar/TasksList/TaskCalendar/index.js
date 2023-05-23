import React, { useState } from 'react';
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';
import { StyledCalendar } from './Calendar.style';
import { useNavigate, useParams } from 'react-router-dom';
import './calendar.css';
import CustomToolbar from './CustomToolbar';
import TaskItem from './TaskItem';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import AppsHeader from '@crema/components/AppsHeader';
import AddNewTask from '../../../../../../../../apps/source/src/modules/apps/Calendar/AddNewTask';

const DragAndDropCalendar = withDragAndDrop(StyledCalendar);

const localizer = momentLocalizer(moment);

const TaskCalender = ({
  taskList,
  onUpdateTask,
  onSetFilterText,
  reCallAPI,
}) => {
  const [isAddTaskOpen, setAddTaskOpen] = useState(false);
  const navigate = useNavigate();
  const { folder, label } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);

  const onSelectDate = ({ start }) => {
    console.log('start: ', start);
    setSelectedDate(start);
    setAddTaskOpen(true);
  };

  const onOpenAddTask = () => {
    if (selectedDate) {
      setAddTaskOpen(true);
    } else {
      setAddTaskOpen(false);
    }
  };
  const resizeEvent = ({ event, start, end }) => {
    onUpdateTask({ ...event, startDate: start, endDate: end });
    console.log('resizeEvent: ', event, start, end);
  };

  const onViewTaskDetail = (task) => {
    if (folder) navigate(`/api/calendar/${folder}/${task.id}`);
    if (label) navigate(`/api/calendar/label/${label}/${task.id}`);
  };
  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    onUpdateTask({ ...event, startDate: start, endDate: end });
  };

  const onCloseAddTask = () => {
    setAddTaskOpen(false);
  };
  const getEvents = () => {
    if (taskList?.length > 0)
      return taskList.map((task) => {
        return {
          ...task,
          title: task.title,
          start: task.startDate,
          end: task.endDate,
        };
      });
    return [];
  };
  return (
    <>
      <DragAndDropCalendar
        localizer={localizer}
        events={getEvents()}
        themeVariant='dark'
        views={['month', 'agenda']}
        tooltipAccessor={null}
        showMultiDayTimes
        resizable
        onEventResize={resizeEvent}
        onEventDrop={moveEvent}
        onSelectEvent={onOpenAddTask}
        components={{
          toolbar: (props) => (
            <AppsHeader>
              <CustomToolbar onSetFilterText={onSetFilterText} {...props} />
            </AppsHeader>
          ),
          event: (item) => <TaskItem key={item.key} item={item.event} />,
        }}
        popup
        selectable
        onSelectSlot={onSelectDate}
        defaultView='month'
      />
      {isAddTaskOpen ? (
        <AddNewTask
          reCallAPI={reCallAPI}
          isAddTaskOpen={isAddTaskOpen}
          onCloseAddTask={onCloseAddTask}
        />
      ) : null}
    </>
  );
};
export default TaskCalender;
TaskCalender.propTypes = {
  taskList: PropTypes.any,
  onUpdateTask: PropTypes.func,
  onSetFilterText: PropTypes.func,
};
