import { lazy } from 'react';

const Alert = lazy(() => import('./Alert'));
const Modal = lazy(() => import('./Modal'));
const Message = lazy(() => import('./Message'));
const Notification = lazy(() => import('./Notification'));
const Progress = lazy(() => import('./Progress'));
const Spin = lazy(() => import('./Spin'));
const PopConfirm = lazy(() => import('./PopConfirm'));
const Drawer = lazy(() => import('./Drawer'));
const Result = lazy(() => import('./Result'));
const Skeleton = lazy(() => import('./Skeleton'));

export const feedBackComponentConfigs = [
  {
    path: '/components/feedback/alert',
    element: <Alert />,
  },
  {
    path: '/components/feedback/modal',
    element: <Modal />,
  },
  {
    path: '/components/feedback/message',
    element: <Message />,
  },
  {
    path: '/components/feedback/notification',
    element: <Notification />,
  },
  {
    path: '/components/feedback/progress',
    element: <Progress />,
  },
  {
    path: '/components/feedback/pop-confirm',
    element: <PopConfirm />,
  },
  {
    path: '/components/feedback/spin',
    element: <Spin />,
  },
  {
    path: '/components/feedback/drawer',
    element: <Drawer />,
  },
  {
    path: '/components/feedback/result',
    element: <Result />,
  },
  {
    path: '/components/feedback/skeleton',
    element: <Skeleton />,
  },
];
