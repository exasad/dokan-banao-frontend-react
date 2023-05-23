import React, { useState } from 'react';
import PropTypes from 'prop-types';

// const CalendarRoot = styled('div')(({theme}) => {
//   return {
//     position: 'relative',
//     width: '100%',
//     height: '100%',
//     '& .schedule-date': {
//       borderRadius: 4,
//       width: 23,
//       height: 23,
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       '& .MuiPickersDay-day': {
//         color: theme.palette.text.white,
//       },
//     },
//   };
// });

const DateSelector = ({ schedules }) => {
  const [day, setDay] = useState(null);

  const handleChange = (day) => {
    setDay(day);
  };

  return (
    <CalendarRoot>
      <StaticDatePicker
        autoOk
        orientation='landscape'
        variant='static'
        openTo='date'
        value={day}
        renderInput={(params) => <TextField {...params} />}
        renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
          const scheduleDate = schedules.find(
            (data) => data.day === day.get('date'),
          );
          if (!scheduleDate) {
            return dayComponent;
          }
          return (
            <Tooltip
              TransitionComponent={Zoom}
              title={scheduleDate.title}
              placement='top'
              arrow
              bgcolor={scheduleDate.color}
            >
              <Box
                sx={{ bgcolor: scheduleDate.color }}
                className='schedule-date'
              >
                {dayComponent}
              </Box>
            </Tooltip>
          );
        }}
        onChange={handleChange}
      />
    </CalendarRoot>
  );
};

export default DateSelector;

DateSelector.propTypes = {
  schedules: PropTypes.array,
};
