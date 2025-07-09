import { lazy } from 'react';

const Anchor = lazy(() => import('./Anchor'));
const FloatButton = lazy(() => import('./BackTop'));
const Divider = lazy(() => import('./Divider'));
const ConfigProvider = lazy(() => import('./ConfigProvider'));

export const otherComponentConfigs = [
  {
    path: '/components/other/anchor',
    element: <Anchor />,
  },
  {
    path: '/components/other/backtop',
    element: <FloatButton />,
  },
  {
    path: '/components/other/divider',
    element: <Divider />,
  },
  {
    path: '/components/other/config-provider',
    element: <ConfigProvider />,
  },
];
