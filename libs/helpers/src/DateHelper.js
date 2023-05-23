import moment from 'moment';
import dayjs from 'dayjs';

export const getFormattedDate = (dateObject, format = 'YYYY-MM-DD') => {
  if (dateObject) return dayjs(dateObject).format(format);
  return '';
};

export const getFormattedDateTime = (
  value = 0,
  unit = 'days',
  format = 'YYYY-MM-DD',
) => {
  if (value === 0) {
    return moment().format(format);
  } else {
    return moment().add(value, unit).format(format);
  }
};

export const getTimeFromNow = (date) => {
  const timestamp = moment(date).format('X');
  const newDate = moment.unix(timestamp);
  return moment(newDate).fromNow();
};
