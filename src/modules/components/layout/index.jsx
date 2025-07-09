import { lazy } from 'react';

const Divider = lazy(() => import('./Divider'));
const Space = lazy(() => import('./Space'));
export const layoutComponentConfigs = [
  {
    path: '/components/layout/divider',
    element: <Divider />,
  },
  {
    path: '/components/layout/space',
    element: <Space />,
  },
];
