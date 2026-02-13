import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import CategoriesList from '../pages/categories/CategoriesList';
import CouponsList from '../pages/coupons/CouponsList';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import DeliveryChargesList from '../pages/delivery-charges/DeliveryChargesList';
import AdminLogin from '../pages/login/AdminLogin';
import OrderDetail from '../pages/orders/OrderDetail';
import OrderEdit from '../pages/orders/OrderEdit';
import OrdersList from '../pages/orders/OrdersList';
import ProductDetail from '../pages/products/ProductDetail';
import ProductForm from '../pages/products/ProductForm';
import ProductsList from '../pages/products/ProductsList';
import Profile from '../pages/profile/Profile';
import CourierSettings from '../pages/settings/CourierSettings';
import DomainSettings from '../pages/settings/DomainSettings';
import FacebookSettings from '../pages/settings/FacebookSettings';
import PaymentSettings from '../pages/settings/PaymentSettings';
import Settings from '../pages/settings/Settings';
import SmsSettings from '../pages/settings/SmsSettings';
import SeoSettings from '../pages/settings/SeoSettings';
import SmtpSettings from '../pages/settings/SmtpSettings';
import LanguageSettings from '../pages/settings/LanguageSettings';
import SlidersList from '../pages/sliders/SlidersList';
import TagsList from '../pages/tags/TagsList';
import ReviewsList from '../pages/reviews/ReviewsList';
import ReturnsList from '../pages/returns/ReturnsList';
import FlashSalesList from '../pages/flash-sales/FlashSalesList';
import FlashSaleForm from '../pages/flash-sales/FlashSaleForm';
import BlogList from '../pages/blog/BlogList';
import BlogForm from '../pages/blog/BlogForm';
import BlogCategories from '../pages/blog/BlogCategories';
import PagesList from '../pages/pages/PagesList';
import PageForm from '../pages/pages/PageForm';
import AbandonedCartsList from '../pages/abandoned-carts/AbandonedCartsList';
import TranslationManager from '../pages/translations/TranslationManager';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='login' element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='sliders' element={<SlidersList />} />
        <Route path='categories' element={<CategoriesList />} />
        <Route path='tags' element={<TagsList />} />
        <Route path='products' element={<ProductsList />} />
        <Route path='products/:id' element={<ProductDetail />} />
        <Route path='products/create' element={<ProductForm />} />
        <Route path='products/:id/edit' element={<ProductForm />} />
        <Route path='orders' element={<OrdersList />} />
        <Route path='orders/:id' element={<OrderDetail />} />
        <Route path='orders/:id/edit' element={<OrderEdit />} />
        <Route path='coupons' element={<CouponsList />} />
        <Route path='delivery-charges' element={<DeliveryChargesList />} />
        <Route path='reviews' element={<ReviewsList />} />
        <Route path='returns' element={<ReturnsList />} />
        <Route path='flash-sales' element={<FlashSalesList />} />
        <Route path='flash-sales/create' element={<FlashSaleForm />} />
        <Route path='flash-sales/:id/edit' element={<FlashSaleForm />} />
        <Route path='blog' element={<BlogList />} />
        <Route path='blog/create' element={<BlogForm />} />
        <Route path='blog/:id/edit' element={<BlogForm />} />
        <Route path='blog/categories' element={<BlogCategories />} />
        <Route path='pages' element={<PagesList />} />
        <Route path='pages/create' element={<PageForm />} />
        <Route path='pages/:id/edit' element={<PageForm />} />
        <Route path='abandoned-carts' element={<AbandonedCartsList />} />
        <Route path='translations' element={<TranslationManager />} />
        <Route path='settings' element={<Settings />} />
        <Route path='settings/couriers' element={<CourierSettings />} />
        <Route path='settings/payments' element={<PaymentSettings />} />
        <Route path='settings/sms' element={<SmsSettings />} />
        <Route path='settings/seo' element={<SeoSettings />} />
        <Route path='settings/facebook' element={<FacebookSettings />} />
        <Route path='settings/smtp' element={<SmtpSettings />} />
        <Route path='settings/domains' element={<DomainSettings />} />
        <Route path='settings/languages' element={<LanguageSettings />} />
        <Route path='profile' element={<Profile />} />
        <Route index element={<Navigate to='dashboard' replace />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
