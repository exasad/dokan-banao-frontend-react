import { Avatar, Badge } from 'antd';

const Offset = () => {
  return (
    <Badge count={5} offset={[10, 10]}>
      <Avatar shape='square' size='large' />
    </Badge>
  );
};

export default Offset;
