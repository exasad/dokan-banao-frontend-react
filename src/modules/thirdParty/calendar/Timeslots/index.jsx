import { dayjsLocalizer } from 'react-big-calendar';
import events from '../events';
import dayjs from 'dayjs';
import { StyledCalendar } from '../index.styled';

const localizer = dayjsLocalizer(dayjs);

const Timeslots = () => {
  return (
    <StyledCalendar
      events={events}
      localizer={localizer}
      step={15}
      timeslots={8}
      defaultView='week'
      defaultDate={new Date(2021, 10, 12)}
    />
  );
};

export default Timeslots;
