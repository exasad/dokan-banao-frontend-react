import React from 'react';
import { Navigate } from 'react-router-dom';

import Error403 from '../../modules/errorPages/Error403';
import { accountPagesConfigs } from './AccountRoutes';
import { samplePagesConfigs } from './SampleRoutes';
import { authRouteConfig } from './AuthRoutes';
import { errorPagesConfigs } from './ErrorPagesRoutes';
import { initialUrl } from '@crema/constants/AppConst';

const authorizedStructure = {
  fallbackPath: '/signin',
  unAuthorizedComponent: <Error403 />,
  routes: [...accountPagesConfigs, ...samplePagesConfigs],
};

const unAuthorizedStructure = {
  fallbackPath: initialUrl,
  routes: authRouteConfig,
};
const anonymousStructure = {
  routes: errorPagesConfigs.concat([
    {
      path: '/',
      element: <Navigate to={initialUrl} />,
    },
    {
      path: '*',
      element: <Navigate to='/error-pages/error-404' />,
    },
  ]),
};

export { authorizedStructure, unAuthorizedStructure, anonymousStructure };
