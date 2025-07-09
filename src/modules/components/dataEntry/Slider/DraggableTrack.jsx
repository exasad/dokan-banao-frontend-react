import { Slider } from 'antd';

const DraggableTrack = () => {
  return (
    <Slider
      style={{ width: '100%' }}
      range={{ draggableTrack: true }}
      defaultValue={[20, 50]}
    />
  );
};

export default DraggableTrack;
