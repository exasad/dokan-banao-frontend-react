import { TimePicker } from 'antd';

const { RangePicker } = TimePicker;

const BorderedLess = () => {
  return (
    <>
      <TimePicker bordered={false} />
      <RangePicker bordered={false} />
    </>
  );
};

export default BorderedLess;
