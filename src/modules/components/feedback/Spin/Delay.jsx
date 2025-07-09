import { Component } from 'react';
import { Alert, Spin, Switch } from 'antd';

class Delay extends Component {
  state = { loading: false };

  toggle = (value) => {
    this.setState({ loading: value });
  };

  render() {
    const container = (
      <Alert
        message='Alert message title'
        description='Further details about the context of this alert.'
        type='info'
      />
    );
    return (
      <div>
        <Spin spinning={this.state.loading} delay={500}>
          {container}
        </Spin>
        <div style={{ marginTop: 16 }}>
          Loading state：
          <Switch checked={this.state.loading} onChange={this.toggle} />
        </div>
      </div>
    );
  }
}

export default Delay;
