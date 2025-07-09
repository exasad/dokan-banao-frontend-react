import { lazy } from 'react';

const Error401 = lazy(() =>
  import('../../../modules/errorPages/Error401'),
);
const Error403 = lazy(() =>
  import('../../../modules/errorPages/Error403'),
);
const Error404 = lazy(() =>
  import('../../../modules/errorPages/Error404'),
);
const Error500 = lazy(() =>
  import('../../../modules/errorPages/Error500'),
);
const Error503 = lazy(() =>
  import('../../../modules/errorPages/Error503'),
);
const ComingSoon = lazy(() =>
  import('../../../modules/errorPages/ComingSoon'),
);
const Maintenance = lazy(() =>
  import('../../../modules/errorPages/Maintenance'),
);

export const errorPagesConfigs = [
  {
    path: '/error-pages/error-401',
    element: <Error401 />,
  },
  {
    path: '/error-pages/error-403',
    element: <Error403 />,
  },
  {
    path: '/error-pages/error-404',
    element: <Error404 />,
  },
  {
    path: '/error-pages/error-500',
    element: <Error500 />,
  },
  {
    path: '/error-pages/error-503',
    element: <Error503 />,
  },
  {
    path: '/error-pages/coming-soon',
    element: <ComingSoon />,
  },
  {
    path: '/error-pages/maintenance',
    element: <Maintenance />,
  },
];
