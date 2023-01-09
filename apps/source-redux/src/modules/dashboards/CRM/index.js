import React, { useEffect } from 'react';
import AppRowContainer from '@crema/components/AppRowContainer';
import AppAnimate from '@crema/components/AppAnimate';
import {
  Deals,
  GoalProgress,
  MonthlyEarning,
  QuickStats,
  Reviews,
  SocialMediaAdvertise,
  Statistics,
  TicketSupport,
  TodayTasks,
  TotalRevenue,
  WebTraffic,
} from '@crema/modules/dashboards/CRM';
import AppLoader from '@crema/components/AppLoader';
import { Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { onGetCrmData } from '../../../redux/actions';

const CRM = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetCrmData());
  }, [dispatch]);

  const crmData = useSelector(({ dashboard }) => dashboard.crmData);

  return crmData ? (
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <AppRowContainer delay={150}>
        <Col xs={24} lg={10} key={'b'}>
          <TotalRevenue revenueData={crmData.revenueData} />
        </Col>
        <Col xs={24} lg={14} className='mb-0' key={'a'}>
          <QuickStats quickStatsData={crmData.quickStatsData} />
        </Col>
        <Col xs={24} lg={16} key={'c'}>
          <Statistics
            clientsData={crmData.statisticsGraph.clientsData}
            incomeData={crmData.statisticsGraph.incomeData}
            projectData={crmData.statisticsGraph.projectData}
          />
        </Col>
        <Col xs={24} lg={8} key={'d'}>
          <MonthlyEarning earningGraphData={crmData.earningGraphData} />
        </Col>
        <Col xs={24} lg={8} key={'e'}>
          <SocialMediaAdvertise socialMediaData={crmData.socialMediaData} />
        </Col>
        <Col xs={24} lg={16} key={'f'}>
          <TodayTasks todayTaskData={crmData.todayTaskData} />
        </Col>
        <Col xs={24} lg={16} key={'g'}>
          <Deals dealsTableData={crmData.dealsTableData} />
        </Col>
        <Col xs={24} lg={8} key={'h'}>
          <GoalProgress progressGraphData={crmData.progressGraphData} />
        </Col>
        <Col xs={24} lg={10} key={'i'}>
          <WebTraffic websiteTrafficData={crmData.websiteTrafficData} />
          <Reviews reviewGraphData={crmData.reviewGraphData} />
        </Col>
        <Col xs={24} lg={14} key={'j'}>
          <TicketSupport ticketSupportData={crmData.ticketSupportData} />
        </Col>
      </AppRowContainer>
    </AppAnimate>
  ) : (
    <AppLoader />
  );
};

export default CRM;
