import React from 'react';
import { Navigate } from 'react-router-dom';
import { RoutePermittedRole } from '@crema/constants/AppEnums';
const Mail = React.lazy(() => import('../../modules/apps/Mail'));
const ToDo = React.lazy(() => import('../../modules/apps/ToDo'));
const Contact = React.lazy(() => import('../../modules/apps/Contact'));
const ScrumBoard = React.lazy(() => import('../../modules/apps/ScrumBoard'));
const Chat = React.lazy(() => import('../../modules/apps/Chat'));
const Wall = React.lazy(() => import('../../modules/apps/Wall'));

export const appsConfig = [
  {
    path: [
      '/apps/mail/folder/:name',
      '/apps/mail/label/:name',
      '/apps/mail/compose',
      '/apps/mail/:name/:id',
    ],
    element: <Mail />,
  },
  {
    path: '/apps/mail',
    element: <Navigate to='/apps/mail/folder/inbox' />,
  },
  {
    path: [
      '/apps/todo/folder/:name',
      '/apps/todo/label/:name',
      '/apps/todo/:name/:id',
    ],
    element: <ToDo />,
  },
  {
    path: '/apps/todo',
    element: <Navigate to='/apps/todo/folder/all' />,
  },
  {
    path: ['/apps/contact/folder/:name', '/apps/contact/label/:name'],
    element: <Contact />,
  },
  {
    path: '/apps/contact',
    element: <Navigate to='/apps/contact/folder/all' />,
  },
  {
    path: ['/apps/scrum-board/:id', '/apps/scrum-board'],
    element: <ScrumBoard />,
  },
  {
    path: ['/apps/chat'],
    element: <Chat />,
  },
  {
    path: ['/apps/wall'],
    element: <Wall />,
  },
];
