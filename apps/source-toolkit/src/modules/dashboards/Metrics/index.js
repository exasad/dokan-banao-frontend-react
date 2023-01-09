import React, { useEffect } from 'react';
import AppRowContainer from '@crema/components/AppRowContainer';
import { Col } from 'antd';
import IntlMessages from '@crema/helpers/IntlMessages';
import {
  ComparisonCard,
  EarningInMonth,
  FloatingGraphs,
  MetricTitleLineGraphCard,
  Orders,
  ProfileViews,
  Sales,
  Share,
  SocialDataCard,
  SocialVisitors,
  Stats,
  StatsCard,
  StatsCardSecond,
  StatsCardWithGraph,
  Subscriptions,
  Visits,
  WorkViews,
  YourAccount,
} from '@crema/modules/dashboards/Metrics';
import AppPageMeta from '@crema/components/AppPageMeta';
import { blue, geekblue, green, grey, red } from '@ant-design/colors';
import { StyledMetricTitleLineView } from './index.styled';
import { useDispatch, useSelector } from 'react-redux';
import { onGetMetricsData } from '../../../toolkit/actions';
import AppLoader from '@crema/components/AppLoader';

const Metrics = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetMetricsData());
  }, [dispatch]);

  const metricsData = useSelector(({ dashboard }) => dashboard.metricsData);

  return (
    <>
      <AppPageMeta title='Metrics' />
      {metricsData ? (
        <div>
          <h2 className='card-outer-title'>
            <IntlMessages id='dashboard.metrics' />
          </h2>

          <AppRowContainer ease={'easeInSine'}>
            <Col xs={24} sm={12} lg={6} key={'a'}>
              <StatsCard
                text={<IntlMessages id='dashboard.ordersThisYear' />}
                value={metricsData.ordersThisYear}
                bgColor={red[5]}
                icon={'/assets/images/metricsIcons/order.svg'}
              />
            </Col>

            <Col xs={24} sm={12} lg={6} key={'b'}>
              <StatsCard
                text={<IntlMessages id='dashboard.revenueThisYear' />}
                value={metricsData.revenueThisYear}
                bgColor={blue[3]}
                icon={'/assets/images/metricsIcons/revenue.svg'}
              />
            </Col>

            <Col xs={24} sm={12} lg={6} key={'c'}>
              <StatsCard
                text={<IntlMessages id='dashboard.visitsThisYear' />}
                value={metricsData.visitsThisYear}
                bgColor={geekblue[6]}
                icon={'/assets/images/metricsIcons/visits.svg'}
              />
            </Col>

            <Col xs={24} sm={12} lg={6} key={'d'}>
              <StatsCard
                text={<IntlMessages id='dashboard.queriesThisYear' />}
                value={metricsData.queriesThisYear}
                bgColor={green[5]}
                icon={'/assets/images/metricsIcons/querries.svg'}
              />
            </Col>

            <Col xs={24} lg={8} key={'e'}>
              <StatsCardWithGraph
                text={<IntlMessages id='dashboard.incomeLastYear' />}
                data={metricsData.incomeLastYear}
                type='incomeGraph'
                valueColor='#FFA940'
              />
            </Col>

            <Col xs={24} lg={8} key={'f'}>
              <StatsCardWithGraph
                text={<IntlMessages id='dashboard.webTraffic' />}
                data={metricsData.websiteTrafficData}
                bgColor='background.paper'
                type='trafficGraph'
                valueColor={red[6]}
              />
            </Col>

            <Col xs={24} lg={8} key={'g'}>
              <StatsCardWithGraph
                text={<IntlMessages id='dashboard.growthInRevenue' />}
                data={metricsData.revenueGrowthData}
                bgColor='background.paper'
                type='revenueGrowth'
                valueColor={blue[5]}
              />
            </Col>

            <Col xs={24} lg={6} key={'h'}>
              <ComparisonCard
                text={<IntlMessages id='dashboard.incrementInUsers' />}
                data={metricsData.incrementActiveUsers}
                type='activeUsers'
                valueColor='#4299E1'
              />
            </Col>

            <Col xs={24} lg={6} key={'i'}>
              <ComparisonCard
                text={<IntlMessages id='dashboard.extraRevenue' />}
                data={metricsData.extraRevenue}
                type='extraRevenue'
                valueColor='#4C51BF'
              />
            </Col>

            <Col xs={24} lg={6} key={'j'}>
              <ComparisonCard
                text={<IntlMessages id='dashboard.trafficRaise' />}
                data={metricsData.trafficRaise}
                type='trafficRaise'
                valueColor={blue[5]}
              />
            </Col>

            <Col xs={24} lg={6} key={'k'}>
              <ComparisonCard
                text={<IntlMessages id='dashboard.lessOrders' />}
                data={metricsData.lessOrders}
                type='lessOrders'
                valueColor={red[5]}
              />
            </Col>

            <Col xs={24} lg={8} key={'l'}>
              <Sales data={metricsData.salesData} />
            </Col>

            <Col xs={24} lg={8} key={'m'}>
              <YourAccount data={metricsData.accountData} />
            </Col>

            <Col xs={24} lg={8} key={'n'}>
              <EarningInMonth data={metricsData.earningInMonth} />
            </Col>

            <Col xs={24} lg={14} key={'o'}>
              <Subscriptions data={metricsData.subscriptionData} />
            </Col>

            <Col xs={24} lg={10} key={'p'}>
              <StyledMetricTitleLineView>
                <MetricTitleLineGraphCard
                  data={metricsData.metricsLineGraphData}
                  title={<IntlMessages id='dashboard.rides' />}
                  titleColor='rgb(73, 80, 87)'
                  valueColor={grey[5]}
                  differenceColor={red[5]}
                  bgColor='white'
                  graphColor='#4299E1'
                />
              </StyledMetricTitleLineView>

              <div>
                <MetricTitleLineGraphCard
                  data={metricsData.metricsLineGraphData}
                  title={<IntlMessages id='dashboard.visits' />}
                  titleColor='white'
                  valueColor={geekblue[3]}
                  differenceColor='white'
                  bgColor={geekblue[5]}
                  graphColor='#FFFFFF'
                />
              </div>
            </Col>

            <Col xs={24} sm={12} lg={6} key={'q'}>
              <StatsCardSecond
                text={<IntlMessages id='dashboard.revenueThisYear' />}
                value={metricsData.revenueThisYear}
                bgColor={blue[5]}
                icon={'/assets/images/metricsIcons/revenue.svg'}
              />
            </Col>

            <Col xs={24} sm={12} lg={6} key={'r'}>
              <StatsCardSecond
                text={<IntlMessages id='dashboard.ordersThisYear' />}
                value={metricsData.ordersThisYear}
                bgColor={red[5]}
                icon={'/assets/images/metricsIcons/order.svg'}
              />
            </Col>

            <Col xs={24} sm={12} lg={6} key={'s'}>
              <StatsCardSecond
                text={<IntlMessages id='dashboard.visitsThisYear' />}
                value={metricsData.visitsThisYear}
                bgColor={geekblue[6]}
                icon={'/assets/images/metricsIcons/visits.svg'}
              />
            </Col>

            <Col xs={24} sm={12} lg={6} key={'t'}>
              <StatsCardSecond
                text={<IntlMessages id='dashboard.queriesThisYear' />}
                value={metricsData.queriesThisYear}
                bgColor={green[5]}
                icon={'/assets/images/metricsIcons/querries.svg'}
              />
            </Col>

            <Col xs={24} lg={6} key={'u'}>
              <FloatingGraphs
                title={<IntlMessages id='dashboard.sales' />}
                data={metricsData.metricsFloatingGraphData.salesData}
              />
            </Col>

            <Col xs={24} lg={6} key={'v'}>
              <FloatingGraphs
                title={<IntlMessages id='dashboard.clients' />}
                data={metricsData.metricsFloatingGraphData.clientsData}
              />
            </Col>

            <Col xs={24} lg={6} key={'x'}>
              <FloatingGraphs
                title={<IntlMessages id='dashboard.revenue' />}
                data={metricsData.metricsFloatingGraphData.revenueData}
              />
            </Col>

            <Col xs={24} lg={6} key={'y'}>
              <FloatingGraphs
                title={<IntlMessages id='dashboard.newUser' />}
                data={metricsData.metricsFloatingGraphData.newUserData}
              />
            </Col>

            <Col xs={24} lg={12} key={'z'}>
              <Visits data={metricsData.visitsData} />
            </Col>

            <Col xs={24} lg={12} key={'aa'}>
              <Orders data={metricsData.ordersData} />
            </Col>

            <Col xs={24} lg={12} xl={6} key={'ab'}>
              <ProfileViews data={metricsData.profileViewsData} />
            </Col>

            <Col xs={24} lg={12} xl={6} key={'ac'}>
              <WorkViews data={metricsData.workViewsData} />
            </Col>

            <Col xs={24} lg={12} xl={6} key={'ad'}>
              <SocialDataCard data={metricsData.socialData} />
            </Col>

            <Col xs={24} lg={12} xl={6} key={'ae'}>
              <Share data={metricsData.shareData} />
            </Col>

            <Col xs={24} lg={12} key={'af'}>
              <Stats data={metricsData.statsGraph} />
            </Col>

            <Col xs={24} lg={12} key={'ag'}>
              <SocialVisitors data={metricsData.socialVisitorsData} />
            </Col>
          </AppRowContainer>
        </div>
      ) : (
        <AppLoader />
      )}
    </>
  );
};

export default Metrics;
