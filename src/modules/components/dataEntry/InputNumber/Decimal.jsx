import { InputNumber, Space } from 'antd';

const Decimal = () => {
  const onChange=(value)=> {
    console.log('changed', value);
  }

  return (
    <Space>
      <InputNumber min={0} max={10} step={0.1} onChange={onChange} />
    </Space>
  );
};

export default Decimal;
