import { Slider } from 'antd';

const formatter = (value) => `${value}%`;
const SliderCustomize = () => (
  <>
    <Slider
      tooltip={{
        formatter,
      }}
    />
    <Slider
      tooltip={{
        formatter: null,
      }}
    />
  </>
);
export default SliderCustomize;
