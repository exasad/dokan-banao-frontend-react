import { Divider, Space, Typography } from 'antd';

const SpaceSplit=()=> {
  return (
    <Space split={<Divider type='vertical' />}>
      <Typography.Link>Link</Typography.Link>
      <Typography.Link>Link</Typography.Link>
      <Typography.Link>Link</Typography.Link>
    </Space>
  );
}

const Split = () => {
  return <SpaceSplit />;
};

export default Split;
