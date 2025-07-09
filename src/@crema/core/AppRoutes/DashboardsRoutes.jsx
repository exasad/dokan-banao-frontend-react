import { lazy } from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const HealthCare = lazy(() =>
  import('../../../modules/dashboards/HealthCare'),
);
const ECommerce = lazy(() =>
  import('../../../modules/dashboards/ECommerce'),
);
const CRM = lazy(() => import('../../../modules/dashboards/CRM'));
const Crypto = lazy(() => import('../../../modules/dashboards/Crypto'));
const Analytics = lazy(() =>
  import('../../../modules/dashboards/Analytics'),
);
const Academy = lazy(() => import('../../../modules/dashboards/Academy'));
const Metrics = lazy(() => import('../../../modules/dashboards/Metrics'));
const Widgets = lazy(() => import('../../../modules/dashboards/Widgets'));

export const dashboardConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/health-care',
    element: <HealthCare />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/e-commerce',
    element: <ECommerce />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/crm',
    element: <CRM />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/crypto',
    element: <Crypto />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/analytics',
    element: <Analytics />,
  },

  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/academy',
    element: <Academy />,
  },

  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/metrics',
    element: <Metrics />,
  },

  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/widgets',
    element: <Widgets />,
  },
];
