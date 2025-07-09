import { cloneElement, Children } from 'react';
import {dayjsLocalizer, Views} from 'react-big-calendar';
import events from '../events';
import { StyledCalendar } from '../index.styled';
import dayjs from "dayjs";

let allViews = Object.keys(Views).map((k) => Views[k]);

const ColoredDateCellWrapper = ({ children }) =>
  cloneElement(Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  });
const localizer = dayjsLocalizer(dayjs);
const Basic = () => {
  return (
    <StyledCalendar
      events={events}
      views={allViews}
      step={60}
      showMultiDayTimes
      defaultDate={new Date(2021, 10, 1)}
      components={{
        timeSlotWrapper: ColoredDateCellWrapper,
      }}
      localizer={localizer}
    />
  );
};
export default Basic;
