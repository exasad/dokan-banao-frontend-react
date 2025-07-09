import { Checkbox, Space } from 'antd';

const onChange=(e)=> {
  console.log(`checked = ${e.target.checked}`);
}

const Basic = () => {
  return (
    <Space>
      <Checkbox onChange={onChange}>Checkbox</Checkbox>
    </Space>
  );
};

export default Basic;
