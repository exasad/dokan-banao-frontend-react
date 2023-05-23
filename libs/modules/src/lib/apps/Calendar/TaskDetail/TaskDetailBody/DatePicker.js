import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import { StyledTodoDetailDatePicker } from '../index.styled';

const DatePickers = (props) => {
  const { scheduleDate, setScheduleDate } = props;

  return (
    <StyledTodoDetailDatePicker className='form-field'>
      <DatePicker
        defaultValue={moment(scheduleDate, 'YYYY-MM-DD')}
        onChange={(value) =>
          setScheduleDate(moment(value).format('YYYY/MM/DD'))
        }
      />
    </StyledTodoDetailDatePicker>
  );
};

export default DatePickers;

DatePickers.propTypes = {
  scheduleDate: PropTypes.any,
  setScheduleDate: PropTypes.func,
};
