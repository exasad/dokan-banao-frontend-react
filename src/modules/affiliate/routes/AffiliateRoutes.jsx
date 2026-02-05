import {Routes, Route, Navigate} from 'react-router-dom';
import AffiliateLayout from '../layouts/AffiliateLayout';
import AffiliateLogin from '../pages/login/AffiliateLogin';
import AffiliateAutoLogin from '../pages/login/AffiliateAutoLogin';
import AffiliateDashboard from '../pages/dashboard/AffiliateDashboard';
import MyCoupons from '../pages/coupons/MyCoupons';
import MyCommissions from '../pages/commissions/MyCommissions';
import MyPayouts from '../pages/payouts/MyPayouts';
import MyTickets from '../pages/tickets/MyTickets';
import CreateTicket from '../pages/tickets/CreateTicket';
import AffiliateTicketDetail from '../pages/tickets/TicketDetail';
import AffiliateProfile from '../pages/profile/AffiliateProfile';

const AffiliateRoutes = () => {
  return (
    <Routes>
      <Route path='login' element={<AffiliateLogin />} />
      <Route path='auto-login' element={<AffiliateAutoLogin />} />
      <Route element={<AffiliateLayout />}>
        <Route path='dashboard' element={<AffiliateDashboard />} />
        <Route path='coupons' element={<MyCoupons />} />
        <Route path='commissions' element={<MyCommissions />} />
        <Route path='payouts' element={<MyPayouts />} />
        <Route path='tickets' element={<MyTickets />} />
        <Route path='tickets/create' element={<CreateTicket />} />
        <Route path='tickets/:id' element={<AffiliateTicketDetail />} />
        <Route path='profile' element={<AffiliateProfile />} />
        <Route index element={<Navigate to='dashboard' replace />} />
      </Route>
    </Routes>
  );
};

export default AffiliateRoutes;
