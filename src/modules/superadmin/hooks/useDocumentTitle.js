import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const routeTitles = {
  '/superadmin/dashboard': 'Dashboard',
  '/superadmin/tenants': 'Tenants',
  '/superadmin/plans': 'Plans',
  '/superadmin/invoices': 'Invoices',
  '/superadmin/settings': 'Settings',
  '/superadmin/profile': 'Profile',
  '/superadmin/login': 'Login',
};

const useDocumentTitle = (customTitle) => {
  const location = useLocation();

  useEffect(() => {
    let title = customTitle;

    if (!title) {
      title = routeTitles[location.pathname];

      // Check for dynamic routes
      if (!title) {
        if (location.pathname.match(/^\/superadmin\/tenants\/\d+$/)) {
          title = 'Tenant Details';
        } else if (location.pathname.match(/^\/superadmin\/tenants\/\d+\/edit$/)) {
          title = 'Edit Tenant';
        }
      }
    }

    document.title = title ? `${title} | Super Admin` : 'Super Admin';
  }, [location.pathname, customTitle]);
};

export default useDocumentTitle;
