import { Component } from 'react';
import { Button, Modal, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

class LocalizedModal extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <>
        <Button type='primary' onClick={this.showModal}>
          Modal
        </Button>
        <Modal
          title='Modal'
          open={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText='确认'
          cancelText='取消'
        >
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
          <p>Bla bla ...</p>
        </Modal>
      </>
    );
  }
}

const confirm=()=> {
  Modal.confirm({
    title: 'Confirm',
    icon: <ExclamationCircleOutlined />,
    content: 'Bla bla ...',
    okText: '确认',
    cancelText: '取消',
  });
}

const Internationalization = () => {
  return (
    <Space>
      <LocalizedModal />
      <Button onClick={confirm}>Confirm</Button>
    </Space>
  );
};

export default Internationalization;
