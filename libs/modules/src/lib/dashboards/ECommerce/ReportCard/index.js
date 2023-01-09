import React from 'react';
import StaticsGraph from './StaticsGraph';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import {
  StyledRechartAction,
  StyledRechartContainer,
  StyledReportCard,
  StyledReportContent,
  StyledReportFlex,
} from './index.styled';

const ReportCard = ({ data }) => {
  return (
    <StyledReportCard className='card-hover' heightFull>
      <StyledReportFlex>
        <StyledReportContent>
          <h3>{data.value}</h3>
          <p>{data.type}</p>
        </StyledReportContent>
        <StyledRechartContainer>
          <StaticsGraph
            id={data.id}
            graphData={data.graphData}
            growth={data.growth}
            strokeColor={data.strokeColor}
          />
          <StyledRechartAction style={{ color: data.strokeColor }}>
            {data.growth > 0 ? (
              <ArrowUpOutlined style={{ color: data.strokeColor }} />
            ) : (
              <ArrowDownOutlined style={{ color: data.strokeColor }} />
            )}
            {data.growth}
          </StyledRechartAction>
        </StyledRechartContainer>
      </StyledReportFlex>
    </StyledReportCard>
  );
};

export default ReportCard;

ReportCard.propTypes = {
  data: PropTypes.object,
};
