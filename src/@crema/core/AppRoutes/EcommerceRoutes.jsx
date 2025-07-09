import { lazy } from 'react';
import { RoutePermittedRole } from '@crema/constants/AppEnums';

const Products = lazy(() =>
  import('../../../modules/ecommerce/Products'),
);
const ProductDetail = lazy(() =>
  import('../../../modules/ecommerce/ProductDetail'),
);
const Customers = lazy(() =>
  import('../../../modules/ecommerce/Customers'),
);
const Checkout = lazy(() =>
  import('../../../modules/ecommerce/Checkout'),
);
const Carts = lazy(() => import('../../../modules/ecommerce/Carts'));
const Orders = lazy(() => import('../../../modules/ecommerce/Orders'));
const Confirmation = lazy(() =>
  import('../../../modules/ecommerce/Confirmation'),
);
const Invoice1 = lazy(() =>
  import('../../../modules/ecommerce/Invoice1'),
);
const Invoice2 = lazy(() =>
  import('../../../modules/ecommerce/Invoice2'),
);

const ProductListing = lazy(() =>
  import('../../../modules/ecommerce/Admin/Listing'),
);
const AddProduct = lazy(() =>
  import('../../../modules/ecommerce/Admin/AddEditProduct'),
);
const EditProduct = lazy(() =>
  import('../../../modules/ecommerce/Admin/EditProduct'),
);

export const ecommerceConfig = [
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce/products',
    element: <Products />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: [
      '/apps/ecommerce/product_detail/',
      '/apps/ecommerce/product_detail/:id',
    ],
    element: <ProductDetail />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce/checkout',
    element: <Checkout />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce/cart',
    element: <Carts />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce/orders',
    element: <Orders />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce/confirmation',
    element: <Confirmation />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce/invoice-1',
    element: <Invoice1 />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce/invoice-2',
    element: <Invoice2 />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce-admin/product-listing',
    element: <ProductListing />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce-admin/add-products',
    element: <AddProduct />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce-admin/edit-products/:id',
    element: <EditProduct />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/apps/ecommerce-admin/customers',
    element: <Customers />,
  },
];
