import { lazy } from 'react';

const Avatar = lazy(() => import('./Avatar'));
const Badge = lazy(() => import('./Badge'));
const Collapse = lazy(() => import('./Collapse'));
const Calendar = lazy(() => import('./Calendar'));
const Cards = lazy(() => import('./Cards'));
const Carousel = lazy(() => import('./Carousel'));
const List = lazy(() => import('./List'));
const Popover = lazy(() => import('./Popover'));
const Tree = lazy(() => import('./Tree'));
const Tooltip = lazy(() => import('./Tooltip'));
const TimeLine = lazy(() => import('./TimeLine'));
const Tag = lazy(() => import('./Tag'));
const Tabs = lazy(() => import('./Tabs'));
const Comment = lazy(() => import('./Comment'));
const Descriptions = lazy(() => import('./Descriptions'));
const Empty = lazy(() => import('./Empty'));
const Image = lazy(() => import('./Image'));
const Statistic = lazy(() => import('./Statistic'));

export const dataDisplayComponentConfigs = [
  {
    path: '/components/dataDisplay/avatar',
    element: <Avatar />,
  },
  {
    path: '/components/dataDisplay/badge',
    element: <Badge />,
  },
  {
    path: '/components/dataDisplay/collapse',
    element: <Collapse />,
  },
  {
    path: '/components/dataDisplay/calendar',
    element: <Calendar />,
  },
  {
    path: '/components/dataDisplay/card',
    element: <Cards />,
  },
  {
    path: '/components/dataDisplay/carousel',
    element: <Carousel />,
  },
  {
    path: '/components/dataDisplay/list',
    element: <List />,
  },
  {
    path: '/components/dataDisplay/popover',
    element: <Popover />,
  },
  {
    path: '/components/dataDisplay/tree',
    element: <Tree />,
  },
  {
    path: '/components/dataDisplay/tooltip',
    element: <Tooltip />,
  },
  {
    path: '/components/dataDisplay/timeline',
    element: <TimeLine />,
  },
  {
    path: '/components/dataDisplay/tag',
    element: <Tag />,
  },
  {
    path: '/components/dataDisplay/tabs',
    element: <Tabs />,
  },
  {
    path: '/components/dataDisplay/comment',
    element: <Comment />,
  },
  {
    path: '/components/dataDisplay/descriptions',
    element: <Descriptions />,
  },
  {
    path: '/components/dataDisplay/empty',
    element: <Empty />,
  },
  {
    path: '/components/dataDisplay/image',
    element: <Image />,
  },
  {
    path: '/components/dataDisplay/statistic',
    element: <Statistic />,
  },
];
