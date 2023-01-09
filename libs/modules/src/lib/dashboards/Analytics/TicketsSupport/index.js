import React from 'react';

import PropTypes from 'prop-types';

import { Collapse, Progress } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import {
  StyledTicketSupportAction,
  StyledTicketSupportCard,
  StyledTicketSupportCollapse,
  StyledTicketSupportCollapseItem,
  StyledTicketSupportOpen,
} from './index.styled';

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}
const genExtra = ({ data }) => (
  <>
    <span> {data.opened} Open</span>
  </>
);

const TicketsSupport = ({ tickets }) => {
  return (
    <StyledTicketSupportCard
      className='no-card-space'
      actions={[
        <StyledTicketSupportAction key={1}>
          <ClockCircleOutlined style={{ fontSize: 16 }} />
          <span>Last update 30 min ago</span>
        </StyledTicketSupportAction>,
      ]}
    >
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        accordion
        onChange={callback}
      >
        {tickets.map((data) => (
          <Panel header={data.name} key={data.id} extra={genExtra({ data })}>
            <StyledTicketSupportCollapse>
              <StyledTicketSupportCollapseItem>
                <StyledTicketSupportOpen>Open</StyledTicketSupportOpen>
                <div className='ant-row ant-row-middle'>
                  <Progress
                    percent={data.overAllPercentage.open}
                    status='active'
                    strokeColor='#5ABE20'
                    trailColor='rgb(214, 214, 214)'
                    strokeWidth={5}
                  />
                </div>
              </StyledTicketSupportCollapseItem>
              <StyledTicketSupportCollapseItem>
                <StyledTicketSupportOpen>Closed</StyledTicketSupportOpen>
                <div className='ant-row ant-row-middle'>
                  <Progress
                    percent={data.overAllPercentage.close}
                    status='active'
                    strokeColor='#F44D54'
                    trailColor='rgb(214, 214, 214)'
                    strokeWidth={5}
                  />
                </div>
              </StyledTicketSupportCollapseItem>
              <StyledTicketSupportCollapseItem>
                <StyledTicketSupportOpen>On Hold</StyledTicketSupportOpen>
                <div className='ant-row ant-row-middle'>
                  <Progress
                    percent={data.overAllPercentage.hold}
                    status='active'
                    strokeColor='#F59821'
                    trailColor='rgb(214, 214, 214)'
                    strokeWidth={5}
                  />
                </div>
              </StyledTicketSupportCollapseItem>
            </StyledTicketSupportCollapse>
          </Panel>
        ))}
      </Collapse>
    </StyledTicketSupportCard>
  );
};

export default TicketsSupport;

TicketsSupport.propTypes = {
  tickets: PropTypes.array,
};
