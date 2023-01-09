import React from 'react';
import AppCard from '@crema/components/AppCard';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Progress } from 'antd';
import {
  StyledCollapseHeaderPanel,
  StyledTrafficCollapse,
  StyledTrafficCollapseContent,
  StyledTrafficCollapseData,
  StyledTrafficCollapseHeader,
  StyledTrafficCollapsePanel,
} from './index.styled';

const TrafficSource = ({ trafficData }) => {
  const { messages } = useIntl();
  return (
    <AppCard title={messages['dashboard.analytics.trafficSource']}>
      <StyledTrafficCollapse
        bordered={false}
        defaultActiveKey={['1']}
        accordion
      >
        {trafficData.map((data) => (
          <StyledTrafficCollapsePanel
            header={
              <StyledCollapseHeaderPanel>
                <StyledTrafficCollapseHeader>
                  <h3>{data.title}</h3>
                  <span>{data.value}%</span>
                </StyledTrafficCollapseHeader>
                <Progress
                  percent={data.value}
                  strokeWidth={10}
                  strokeColor='#0698EC'
                  trailColor='#d6d6d6'
                  showInfo={false}
                />
              </StyledCollapseHeaderPanel>
            }
            key={data.id}
          >
            <StyledTrafficCollapseContent>
              <StyledTrafficCollapseData>
                {data.session}
              </StyledTrafficCollapseData>
              <span>Session</span>
            </StyledTrafficCollapseContent>
          </StyledTrafficCollapsePanel>
        ))}
      </StyledTrafficCollapse>
    </AppCard>
  );
};

export default TrafficSource;

TrafficSource.propTypes = {
  trafficData: PropTypes.array,
};
