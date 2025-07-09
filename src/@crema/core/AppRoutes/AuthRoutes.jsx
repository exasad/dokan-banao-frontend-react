import { lazy } from 'react';

const Signin = lazy(() => import('../../../modules/auth/Signin'));
const Signup = lazy(() => import('../../../modules/auth/Signup'));
const ForgotPassword = lazy(() =>
  import('../../../modules/auth/ForgetPassword/ForgetPasswordJwtAuth'),
);
const ConfirmSignupAwsCognito = lazy(() =>
  import('../../../modules/auth/Signup/ConfirmSignupAwsCognito'),
);
const ResetPasswordAwsCognito = lazy(() =>
  import('../../../modules/auth/ForgetPassword/ResetPasswordAwsCognito'),
);
export const authRouteConfig = [
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/forget-password',
    element: <ForgotPassword />,
  },
  {
    path: '/confirm-signup',
    element: <ConfirmSignupAwsCognito />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordAwsCognito />,
  },
];
