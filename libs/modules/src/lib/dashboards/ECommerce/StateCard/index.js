import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import {
  StyledAppCard,
  StyledArrowWrapper,
  StyledFlex,
  StyledFlexWrapper,
  StyledSecondaryText,
  StyledStateWrapper,
  StyledText,
} from './index.styled';
import { Typography } from 'antd';
import Icon from '@ant-design/icons';

const StateCard = ({ data }) => {
  return (
    <StyledAppCard className='no-card-space-ltr-rtl'>
      <StyledStateWrapper color={data.color}>
        <div className='state-icon'>
          <div className='hsIcon'>
            <Icon type={data.icon} className='icons' />
            {/* <div className='icons'>{data.icon}</div> */}
          </div>
        </div>
        <div className='state-content'>
          <StyledFlex>
            <Typography.Title
              level={2}
              style={{
                fontSize: 20,
                marginBottom: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              <FormattedNumber value={+data.value} />
            </Typography.Title>
            <StyledText>{data.title}</StyledText>
          </StyledFlex>
          <StyledFlexWrapper>
            <span className='state-growth'>
              {data.growth}%<StyledArrowWrapper>^</StyledArrowWrapper>
            </span>
            <div>
              <StyledSecondaryText>in 30 days</StyledSecondaryText>
            </div>
          </StyledFlexWrapper>
        </div>
      </StyledStateWrapper>
    </StyledAppCard>
  );
};

export default StateCard;

StateCard.propTypes = {
  data: PropTypes.object,
};
