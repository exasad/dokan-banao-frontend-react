import { lazy } from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Flat = lazy(() => import('../../../modules/userList/Flat'));
const Modern = lazy(() => import('../../../modules/userList/Modern'));
const Standard = lazy(() => import('../../../modules/userList/Standard'));
export const userListConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: '/extra-pages/list-type/flat',
    element: <Flat />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/extra-pages/list-type/modern',
    element: <Modern />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/extra-pages/list-type/standard',
    element: <Standard />,
  },
];
