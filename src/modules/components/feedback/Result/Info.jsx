import { Button, Result } from 'antd';

const Info = () => {
  return (
    <Result
      title='Your operation has been executed'
      extra={
        <Button type='primary' key='console'>
          Go Console
        </Button>
      }
    />
  );
};

export default Info;
