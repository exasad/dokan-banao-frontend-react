import { Calendar, Space } from 'antd';

const CalendarCard = () => {
  const onPanelChange=(value, mode)=> {
    console.log(value, mode);
  }

  return (
    <Space direction='vertical'>
      <Calendar fullscreen={false} onPanelChange={onPanelChange} />
    </Space>
  );
};

export default CalendarCard;
