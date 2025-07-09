import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Mail = lazy(() => import('../../../modules/apps/Mail'));
const ToDo = lazy(() => import('../../../modules/apps/ToDo'));
const Calendar = lazy(() => import('../../../modules/apps/Calendar'));
const Contact = lazy(() => import('../../../modules/apps/Contact'));
const ScrumBoard = lazy(() => import('../../../modules/apps/ScrumBoard'));
const Chat = lazy(() => import('../../../modules/apps/Chat'));
const Wall = lazy(() => import('../../../modules/apps/Wall'));

export const appsConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: [
      '/apps/mail/folder/:name',
      '/apps/mail/label/:name',
      '/apps/mail/compose',
      '/apps/mail/:name/:id',
    ],
    element: <Mail />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/mail',
    element: <Navigate to='/apps/mail/folder/inbox' />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: [
      '/apps/todo/folder/:name',
      '/apps/todo/label/:name',
      '/apps/todo/:name/:id',
    ],
    element: <ToDo />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/todo',
    element: <Navigate to='/apps/todo/folder/all' />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: [
      '/apps/calender/label/:label',
      '/apps/calender/label/:label/:id',
      '/apps/calender/:folder',
      '/apps/calender/:folder/:id',
    ],
    element: <Calendar />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/calender',
    element: <Navigate to='/apps/calender/all' />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: ['/apps/contact/folder/:name', '/apps/contact/label/:name'],
    element: <Contact />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/contact',
    element: <Navigate to='/apps/contact/folder/all' />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: ['/apps/scrum-board/:id', '/apps/scrum-board'],
    element: <ScrumBoard />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: ['/apps/chat'],
    element: <Chat />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: ['/apps/wall'],
    element: <Wall />,
  },
];
