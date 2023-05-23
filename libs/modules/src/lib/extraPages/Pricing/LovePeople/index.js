import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'antd';
import { StyledLovePeopleCard, StyledLovePeopleRow } from './index.styled.js';
import PeopleCard from './PeopleCard/index.js';

const LovePeople = ({ data }) => {
  return (
    <StyledLovePeopleCard align='center'>
      <StyledLovePeopleRow>
        {data.map((data) => (
          <Col xs={24} md={12} lg={8} key={data.id}>
            <PeopleCard data={data} />
          </Col>
        ))}
      </StyledLovePeopleRow>
    </StyledLovePeopleCard>
  );
};

export default LovePeople;

LovePeople.propTypes = {
  pricing: PropTypes.array,
};
