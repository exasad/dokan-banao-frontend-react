import { lazy } from 'react';

const Button = lazy(() => import('./Button'));
const Typography = lazy(() => import('./Typography'));
const Icon = lazy(() => import('./Icon'));

export const generalComponentConfigs = [
  {
    path: '/components/general/button',
    element: <Button />,
  },
  {
    path: '/components/general/typography',
    element: <Typography />,
  },
  {
    path: '/components/general/icon',
    element: <Icon />,
  },
];
