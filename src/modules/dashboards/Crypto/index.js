import React from 'react';
import {Col} from 'antd';
import AppRowContainer from '@crema/components/AppRowContainer';
import AppAnimate from '@crema/components/AppAnimate';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import {
  ATCStatics,
  BuySell,
  CardDetails,
  Coins,
  GainerLooser,
  OrdersActivities,
  QuickTransfer,
  TopStories,
  TotalBalance,
  TradingChart,
} from '@crema/modules/dashboards/Crypto';
import AppLoader from '@crema/components/AppLoader';

const Crypto = () => {
  const [{apiData: cryptoData, loading}] = useGetDataApi('/dashboard/crypto');

  return loading ? (
    <AppLoader />
  ) : (
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <AppRowContainer>
        <Col xs={24} md={10}>
          <TotalBalance totalBalanceData={cryptoData.totalBalanceData} />
        </Col>

        <Col xs={24} md={14}>
          <Coins coinsData={cryptoData.coinsData} />
        </Col>

        <Col xs={24} md={16} lg={18}>
          <TradingChart />
        </Col>

        <Col xs={24} md={8} lg={6}>
          <BuySell buySell={cryptoData.buySell} />
        </Col>

        <Col xs={24} md={12} lg={16}>
          <OrdersActivities ordersActivities={cryptoData.ordersActivities} />
        </Col>

        <Col xs={24} md={12} lg={8}>
          <TopStories stories={cryptoData.stories} />
        </Col>

        <Col xs={24} md={12}>
          <GainerLooser data={cryptoData.gainerLooser} />
        </Col>
        <Col xs={24} md={12}>
          <ATCStatics data={cryptoData.atcStatics} />
        </Col>
        <Col xs={24} md={12}>
          <CardDetails cardDetails={cryptoData.cardDetails} />
        </Col>
        <Col xs={24} md={12}>
          <QuickTransfer quickTransfer={cryptoData.quickTransfer} />
        </Col>
      </AppRowContainer>
    </AppAnimate>
  );
};

export default Crypto;
