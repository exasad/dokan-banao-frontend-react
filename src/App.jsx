import {lazy, Suspense} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './styles/index.css';
import {Spin, App as AntApp} from 'antd';

const SuperAdminApp = lazy(() => import('./modules/superadmin/SuperAdminApp'));
const AffiliateApp = lazy(() => import('./modules/affiliate/AffiliateApp'));
const AdminApp = lazy(() => import('./modules/ecommerce/AdminApp'));

const SuspenseLoader = ({children}) => (
  <Suspense
    fallback={
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
        }}
      >
        <Spin size='large' />
      </div>
    }
  >
    {children}
  </Suspense>
);

const App = () => {
  return (
    <AntApp>
    <BrowserRouter>
      <Routes>
        <Route
          path='/superadmin/*'
          element={
            <SuspenseLoader>
              <SuperAdminApp />
            </SuspenseLoader>
          }
        />
        <Route
          path='/affiliate/*'
          element={
            <SuspenseLoader>
              <AffiliateApp />
            </SuspenseLoader>
          }
        />
        <Route
          path='/*'
          element={
            <SuspenseLoader>
              <AdminApp />
            </SuspenseLoader>
          }
        />
      </Routes>
    </BrowserRouter>
    </AntApp>
  );
};

export default App;
