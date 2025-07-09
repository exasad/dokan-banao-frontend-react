import { Component } from 'react';
import { Pagination } from 'antd';

class Controlled extends Component {
  state = {
    current: 3,
  };

  onChange = (page) => {
    this.setState({
      current: page,
    });
  };

  render() {
    return (
      <Pagination
        current={this.state.current}
        onChange={this.onChange}
        total={50}
      />
    );
  }
}

export default Controlled;
