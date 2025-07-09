import { Slider, Space } from 'antd';

const SliderEvent = () => {
    const onChange=(value)=> {
    console.log('onChange: ', value);
  }

    const onAfterChange=(value)=> {
    console.log('onAfterChange: ', value);
  }

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Slider
        defaultValue={30}
        onChange={onChange}
        onAfterChange={onAfterChange}
      />
      <Slider
        range
        step={10}
        defaultValue={[20, 50]}
        onChange={onChange}
        onAfterChange={onAfterChange}
      />
    </Space>
  );
};

export default SliderEvent;
