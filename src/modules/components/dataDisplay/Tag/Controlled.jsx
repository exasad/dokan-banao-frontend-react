import { Component } from 'react';
import { Button, Tag } from 'antd';

class Controlled extends Component {
  state = {
    visible: true,
  };

  render() {
    return (
      <>
        <Tag
          closable
          open={this.state.visible}
          onClose={() => this.setState({ visible: false })}
        >
          Movies
        </Tag>
        <br />
        <Button
          size='small'
          onClick={() => this.setState({ visible: !this.state.visible })}
        >
          Toggle
        </Button>
      </>
    );
  }
}

export default Controlled;
