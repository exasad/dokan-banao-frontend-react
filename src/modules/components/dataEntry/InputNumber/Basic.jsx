import { InputNumber, Space } from 'antd';

const Basic = () => {
  const onChange=(value)=> {
    console.log('changed', value);
  }

  return (
    <Space>
      <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
    </Space>
  );
};

export default Basic;
