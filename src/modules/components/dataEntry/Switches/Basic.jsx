import { Space, Switch } from 'antd';

const Basic = () => {
  const onChange=(checked)=> {
    console.log(`switch to ${checked}`);
  }

  return (
    <Space>
      <Switch defaultChecked onChange={onChange} />
    </Space>
  );
};

export default Basic;
