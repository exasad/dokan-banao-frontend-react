import { Suspense } from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../AppLoader';

const AppSuspense = (props) => {
  return (
    <Suspense fallback={<AppLoader {...props.loadingProps} />}>
      {props.children}
    </Suspense>
  );
};

AppSuspense.propTypes = {
  loadingProps: PropTypes.object,
};

AppSuspense.defaultProps = {
  loadingProps: {
    delay: 300,
  },
};

export default AppSuspense;

AppSuspense.propTypes = {
  children: PropTypes.node.isRequired,
};
