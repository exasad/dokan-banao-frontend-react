import { useState } from 'react';
import { Button, Space, Switch } from 'antd';

const SwitchDisabled = () => {
  const [disabled, setDisabled] = useState(true);

  const toggle = () => {
    setDisabled(!disabled);
  };

  return (
    <Space>
      <Switch disabled={disabled} defaultChecked />
      <br />
      <Button type='primary' onClick={toggle}>
        Toggle disabled
      </Button>
    </Space>
  );
};

export default SwitchDisabled;
