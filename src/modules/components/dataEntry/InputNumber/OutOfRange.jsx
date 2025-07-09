import { Button, InputNumber, Space } from 'antd';
import { useState } from 'react';

const OutOfRange = () => {
  const [value, setValue] = useState('99');
  return (
    <Space>
      <InputNumber min={1} max={10} value={value} onChange={setValue} />
      <Button
        type='primary'
        onClick={() => {
          setValue(99);
        }}
      >
        Reset
      </Button>
    </Space>
  );
};

export default OutOfRange;
