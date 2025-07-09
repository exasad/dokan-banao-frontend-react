import { Space, Spin } from 'antd';

const Size = () => {
  return (
    <Space>
      <Spin size='small' />
      <Spin />
      <Spin size='large' />
    </Space>
  );
};

export default Size;
