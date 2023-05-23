import React from 'react';
import PropTypes from 'prop-types';
import PackageCard from './PackageCard';
import { Col } from 'antd';
import { StyledPackageOneCard, StyledPackageOneRow } from './index.styled';

const PackageOneNew = ({ billingFormat, pricing }) => {
  return (
    <StyledPackageOneCard title='Pricing Package Style 1'>
      <StyledPackageOneRow>
        {pricing.map((data, index) => (
          <Col xs={24} md={12} lg={8} key={index}>
            <PackageCard billingFormat={billingFormat} pricing={data} />
          </Col>
        ))}
      </StyledPackageOneRow>
    </StyledPackageOneCard>
  );
};

export default PackageOneNew;

PackageOneNew.propTypes = {
  billingFormat: PropTypes.string,
  pricing: PropTypes.array,
};
