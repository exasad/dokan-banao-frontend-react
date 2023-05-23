import React from 'react';
import PropTypes from 'prop-types';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log('error: ', error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log('errorInfo: ', errorInfo);
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryWrapper>
          <WarningOutlinedStyled />
          <SomethingWentWrong>Ah! Something went wrong.</SomethingWentWrong>
          <TextWrapper>Brace yourself till we get the error fixed.</TextWrapper>
          <TextWrapper>
            You may also refresh the page or try again later
          </TextWrapper>

          <ErrorBtn
            onClick={() => {
              window.location.reload();
            }}
          >
            Try Again
          </ErrorBtn>
        </ErrorBoundaryWrapper>
      );
    } else {
      return this.props.children;
    }
  }
}

AppErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppErrorBoundary;
