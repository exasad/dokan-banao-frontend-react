import { Avatar, Badge } from 'antd';

const Size = () => {
  return (
    <div style={{ maxWidth: 200 }}>
      <Badge size='default' count={5}>
        <Avatar shape='square' size='large' />
      </Badge>
      <Badge size='small' count={5}>
        <Avatar shape='square' size='large' />
      </Badge>
    </div>
  );
};

export default Size;
