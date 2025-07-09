import { lazy } from 'react';

const Affix = lazy(() => import('./Affix'));
const Breadcrumb = lazy(() => import('./Breadcrumb'));
const Dropdown = lazy(() => import('./Dropdown'));
const Menu = lazy(() => import('./Menu'));
const Pagination = lazy(() => import('./Pagination'));
const PageHeader = lazy(() => import('./PageHeader'));
const Steps = lazy(() => import('./Steps'));

export const navigationComponentConfigs = [
  {
    path: '/components/navigation/affix',
    element: <Affix />,
  },
  {
    path: '/components/navigation/breadcrumb',
    element: <Breadcrumb />,
  },
  {
    path: '/components/navigation/dropdown',
    element: <Dropdown />,
  },
  {
    path: '/components/navigation/menu',
    element: <Menu />,
  },
  {
    path: '/components/navigation/pagination',
    element: <Pagination />,
  },
  {
    path: '/components/navigation/page-header',
    element: <PageHeader />,
  },
  {
    path: '/components/navigation/steps',
    element: <Steps />,
  },
];
