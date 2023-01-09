import React, { useEffect } from 'react';
import { Col } from 'antd';
import AppRowContainer from '@crema/components/AppRowContainer';
import AppAnimate from '@crema/components/AppAnimate';
import {
  Bitcoin,
  BtcVolumeCurrency,
  BuySell,
  Coins,
  CryptoMarketActivity,
  LatestNews,
  PopularCoins,
  TotalBalance,
} from '@crema/modules/dashboards/Crypto';
import AppLoader from '@crema/components/AppLoader';
import { useDispatch, useSelector } from 'react-redux';
import { onGetCryptoData } from '../../../redux/actions';

const Crypto = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetCryptoData());
  }, [dispatch]);

  const cryptoData = useSelector(({ dashboard }) => dashboard.cryptoData);

  return cryptoData ? (
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <AppRowContainer>
        <Col xs={24} md={10}>
          <TotalBalance totalBalanceData={cryptoData.totalBalanceData} />
        </Col>

        <Col xs={24} md={14}>
          <Coins coinsData={cryptoData.coinsData} />
        </Col>

        <Col xs={24} md={16}>
          <Bitcoin coinGraphData={cryptoData.coinGraphData} />
        </Col>

        <Col xs={24} md={8}>
          <BuySell buySell={cryptoData.buySell} />
        </Col>

        <Col xs={24} md={8}>
          <BtcVolumeCurrency data={cryptoData.btcChartData} />
        </Col>

        <Col xs={24} md={16}>
          <PopularCoins popularCoins={cryptoData.popularCoins} />
        </Col>

        <Col xs={24} md={12}>
          <LatestNews newsData={cryptoData.newsData} />
        </Col>

        <Col xs={24} md={12}>
          <CryptoMarketActivity marketGraphData={cryptoData.marketGraphData} />
        </Col>
      </AppRowContainer>
    </AppAnimate>
  ) : (
    <AppLoader />
  );
};

export default Crypto;
