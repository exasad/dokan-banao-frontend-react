import { Component } from 'react';
import { Button, Modal, Space } from 'antd';

class Basic extends Component {
  state = { visible: false };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <Space>
        <Button type='primary' onClick={this.showModal}>
          Open
        </Button>
        <Modal
          title='Basic Modal'
          open={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </Space>
    );
  }
}

export default Basic;
