import React,{ useState } from 'react';
import { dateFnsLocalizer } from 'react-big-calendar'
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import './calendar.css';
import CustomToolbar from './CustomToolbar';
import TaskItem from './TaskItem';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import {StyledCalendar} from "./Calendar.style.jsx";

const locales = {
  'en-US': enUS,
}

const DnDCalendar = withDragAndDrop(StyledCalendar)

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const TaskCalender = ({ taskList, onUpdateTask, onSetFilterText }) => {
  const navigate = useNavigate();
  const { folder, label } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);

  const onSelectDate = ({ start }) => {
    setSelectedDate(start);
  };

  const onOpenAddTask = (data) => {
    if (data) {
      onViewTaskDetail(data);
    } else {
      console.log('selectedDate', selectedDate);
    }
  };
  const resizeEvent = ({ event, start, end }) => {
    onUpdateTask({ ...event, startDate: start, endDate: end });
  };

  const onViewTaskDetail = (task) => {
    if (folder) navigate(`/apps/calender/${folder}/${task.id}`);
    if (label) navigate(`/apps/calender/label/${label}/${task.id}`);
  };
  const moveEvent = ({ event, start, end }) => {
    onUpdateTask({ ...event, startDate: start, endDate: end });
  };

  const getEvents = () => {
    if (taskList?.length > 0)
      return taskList.map((task) => {
        return {
          ...task,
          title: task.title,
          start: new Date(task.startDate),
          end: new Date(task.endDate),
        };
      });
    return [];
  };
  return (
      <DnDCalendar
      localizer={localizer}
      events={getEvents()}
      // themeVariant='dark'
      views={['month', 'agenda']}
      tooltipAccessor={undefined}
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
        event: ({ event }) => <TaskItem item={event} />,
      }}
      popup
      selectable
      onSelectSlot={onSelectDate}
      defaultView='month'
    />

  );
};
export default TaskCalender;
TaskCalender.propTypes = {
  taskList: PropTypes.any,
  onUpdateTask: PropTypes.func,
  onSetFilterText: PropTypes.func,
};
