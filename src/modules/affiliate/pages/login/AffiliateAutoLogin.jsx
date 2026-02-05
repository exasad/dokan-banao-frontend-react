import {useEffect} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {Spin} from 'antd';

const AffiliateAutoLogin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('affiliate_token', token);
      navigate('/affiliate/dashboard', {replace: true});
    } else {
      navigate('/affiliate/login', {replace: true});
    }
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
      }}
    >
      <Spin size='large' />
    </div>
  );
};

export default AffiliateAutoLogin;
