import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/sliders': 'Sliders',
  '/categories': 'Categories',
  '/tags': 'Tags',
  '/products': 'Products',
  '/products/create': 'Add Product',
  '/orders': 'Orders',
  '/coupons': 'Coupons',
  '/delivery-charges': 'Delivery Charges',
  '/settings': 'Settings',
  '/settings/couriers': 'Courier Settings',
  '/settings/payments': 'Payment Settings',
  '/settings/sms': 'SMS Settings',
  '/settings/facebook': 'Facebook Settings',
  '/settings/smtp': 'SMTP Settings',
  '/profile': 'Profile',
  '/login': 'Login',
};

const useDocumentTitle = (customTitle) => {
  const location = useLocation();

  useEffect(() => {
    let title = customTitle;

    if (!title) {
      // Check for exact match first
      title = routeTitles[location.pathname];

      // Check for dynamic routes
      if (!title) {
        if (location.pathname.match(/^\/products\/\d+$/)) {
          title = 'Product Details';
        } else if (location.pathname.match(/^\/products\/\d+\/edit$/)) {
          title = 'Edit Product';
        } else if (location.pathname.match(/^\/orders\/\d+$/)) {
          title = 'Order Details';
        } else if (location.pathname.match(/^\/orders\/\d+\/edit$/)) {
          title = 'Edit Order';
        }
      }
    }

    document.title = title ? `${title} | Admin` : 'Admin Panel';
  }, [location.pathname, customTitle]);
};

export default useDocumentTitle;
