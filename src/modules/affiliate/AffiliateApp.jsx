import AffiliateAuthProvider from './context/AffiliateAuthProvider';
import AffiliateRoutes from './routes/AffiliateRoutes';

const AffiliateApp = () => {
  return (
    <AffiliateAuthProvider>
      <AffiliateRoutes />
    </AffiliateAuthProvider>
  );
};

export default AffiliateApp;
