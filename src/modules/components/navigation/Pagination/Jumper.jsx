import { Pagination, Space } from 'antd';

const onChange=(pageNumber)=> {
  console.log('Page: ', pageNumber);
}

const Jumper = () => {
  return (
    <Space wrap>
      <Pagination
        showQuickJumper
        defaultCurrent={2}
        total={500}
        onChange={onChange}
      />
      <br />
      <Pagination
        showQuickJumper
        defaultCurrent={2}
        total={500}
        onChange={onChange}
        disabled
      />
    </Space>
  );
};

export default Jumper;
