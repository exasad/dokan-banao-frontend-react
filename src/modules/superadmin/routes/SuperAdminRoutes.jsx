import {Routes, Route, Navigate} from 'react-router-dom';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import SuperAdminLogin from '../pages/login/SuperAdminLogin';
import SuperAdminDashboard from '../pages/dashboard/SuperAdminDashboard';
import PlansList from '../pages/plans/PlansList';
import PlanForm from '../pages/plans/PlanForm';
import TenantsList from '../pages/tenants/TenantsList';
import TenantForm from '../pages/tenants/TenantForm';
import TenantDetail from '../pages/tenants/TenantDetail';
import InvoicesList from '../pages/invoices/InvoicesList';
import InvoiceForm from '../pages/invoices/InvoiceForm';
import InvoiceDetail from '../pages/invoices/InvoiceDetail';
import SettingsPage from '../pages/settings/SettingsPage';
import {
  LandingHero,
  LandingFeatures,
  LandingStats,
  LandingCta,
  LandingFooter,
  LandingAnalytics,
} from '../pages/landing/LandingPageSettings';
import AffiliatesList from '../pages/affiliates/AffiliatesList';
import AffiliateForm from '../pages/affiliates/AffiliateForm';
import AffiliateDetail from '../pages/affiliates/AffiliateDetail';
import CouponsList from '../pages/coupons/CouponsList';
import CouponForm from '../pages/coupons/CouponForm';
import CouponDetail from '../pages/coupons/CouponDetail';
import CommissionsList from '../pages/commissions/CommissionsList';
import PayoutsList from '../pages/payouts/PayoutsList';
import TicketsList from '../pages/tickets/TicketsList';
import TicketDetail from '../pages/tickets/TicketDetail';
import RevenueReport from '../pages/reports/RevenueReport';
import CommissionReport from '../pages/reports/CommissionReport';
import PayoutReport from '../pages/reports/PayoutReport';
import AffiliatePerformanceReport from '../pages/reports/AffiliatePerformanceReport';
import CouponPerformanceReport from '../pages/reports/CouponPerformanceReport';
import SeedDataList from '../pages/seed-data/SeedDataList';
import ContactMessagesList from '../pages/contact/ContactMessagesList';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path='login' element={<SuperAdminLogin />} />
      <Route element={<SuperAdminLayout />}>
        <Route path='dashboard' element={<SuperAdminDashboard />} />
        <Route path='plans' element={<PlansList />} />
        <Route path='plans/create' element={<PlanForm />} />
        <Route path='plans/:id/edit' element={<PlanForm />} />
        <Route path='tenants' element={<TenantsList />} />
        <Route path='tenants/create' element={<TenantForm />} />
        <Route path='tenants/:id' element={<TenantDetail />} />
        <Route path='tenants/:id/edit' element={<TenantForm />} />
        <Route path='invoices' element={<InvoicesList />} />
        <Route path='invoices/create' element={<InvoiceForm />} />
        <Route path='invoices/:id' element={<InvoiceDetail />} />
        <Route path='affiliates' element={<AffiliatesList />} />
        <Route path='affiliates/create' element={<AffiliateForm />} />
        <Route path='affiliates/:id' element={<AffiliateDetail />} />
        <Route path='affiliates/:id/edit' element={<AffiliateForm />} />
        <Route path='coupons' element={<CouponsList />} />
        <Route path='coupons/create' element={<CouponForm />} />
        <Route path='coupons/:id' element={<CouponDetail />} />
        <Route path='coupons/:id/edit' element={<CouponForm />} />
        <Route path='commissions' element={<CommissionsList />} />
        <Route path='payouts' element={<PayoutsList />} />
        <Route path='tickets' element={<TicketsList />} />
        <Route path='tickets/:id' element={<TicketDetail />} />
        <Route path='reports/revenue' element={<RevenueReport />} />
        <Route path='reports/commissions' element={<CommissionReport />} />
        <Route path='reports/payouts' element={<PayoutReport />} />
        <Route path='reports/affiliates' element={<AffiliatePerformanceReport />} />
        <Route path='reports/coupons' element={<CouponPerformanceReport />} />
        <Route path='seed-data' element={<SeedDataList />} />
        <Route path='landing/hero' element={<LandingHero />} />
        <Route path='landing/features' element={<LandingFeatures />} />
        <Route path='landing/stats' element={<LandingStats />} />
        <Route path='landing/cta' element={<LandingCta />} />
        <Route path='landing/footer' element={<LandingFooter />} />
        <Route path='landing/analytics' element={<LandingAnalytics />} />
        <Route path='contact-messages' element={<ContactMessagesList />} />
        <Route path='settings' element={<SettingsPage />} />
        <Route index element={<Navigate to='dashboard' replace />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;
