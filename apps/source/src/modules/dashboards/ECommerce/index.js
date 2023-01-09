import React from 'react';
import { Col } from 'antd';
import AppRowContainer from '@crema/components/AppRowContainer';
import AppAnimate from '@crema/components/AppAnimate';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import {
  Application,
  Browser,
  MarketingCampaign,
  NewCustomers,
  Notifications,
  PopularProducts,
  RecentOrders,
  ReportCard,
  Revenue,
  SalesState,
  SaleStatics,
  SiteVisitors,
} from '@crema/modules/dashboards/ECommerce';
import AppLoader from '@crema/components/AppLoader';

const ECommerce = () => {
  const [{ apiData: ecommerceData, loading }] = useGetDataApi(
    '/dashboard/ecommerce',
  );

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <AppRowContainer>
            {ecommerceData.salesState.map((state, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <SalesState state={state} />
              </Col>
            ))}
            <Col xs={24} lg={18}>
              <SaleStatics />
            </Col>
            <Col xs={24} lg={6}>
              <Application />
            </Col>
            {ecommerceData.reportCards.map((report, index) => (
              <Col xs={24} md={8} key={index}>
                <ReportCard data={report} />
              </Col>
            ))}
            <Col xs={24} lg={18}>
              <RecentOrders recentOrders={ecommerceData.recentOrders} />
            </Col>
            <Col xs={24} lg={6}>
              <Revenue />
            </Col>

            <Col xs={24} md={12}>
              <MarketingCampaign
                marketingCampaign={ecommerceData.marketingCampaign}
              />
            </Col>
            <Col xs={24} md={12}>
              <Notifications notifications={ecommerceData.notifications} />
            </Col>

            <Col xs={24} md={12}>
              <NewCustomers newCustomers={ecommerceData.newCustomers} />
            </Col>
            <Col xs={24} md={12}>
              <PopularProducts
                popularProducts={ecommerceData.popularProducts}
              />
            </Col>

            <Col xs={24} lg={18}>
              <SiteVisitors siteVisitorsData={ecommerceData.siteVisitors} />
            </Col>
            <Col xs={24} lg={6}>
              <Browser browserData={ecommerceData.browser} />
            </Col>
          </AppRowContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default ECommerce;
