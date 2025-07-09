import { Pagination } from 'antd';

const ShowAll = () => {
  return (
    <Pagination
      total={85}
      showSizeChanger
      showQuickJumper
      showTotal={(total) => `Total ${total} items`}
    />
  );
};

export default ShowAll;
