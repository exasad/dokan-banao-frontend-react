import { Button, Result } from 'antd';

const Error500 = () => {
  return (
    <Result
      status='500'
      title='500'
      subTitle='Sorry, something went wrong.'
      extra={<Button type='primary'>Back Home</Button>}
    />
  );
};

export default Error500;
