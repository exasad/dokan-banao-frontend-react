import React from 'react';
import AppRowContainer from '@crema/components/AppRowContainer';
import { Col } from 'antd';
import {
  StyledProductDetailItemTitle,
  StyledProductDetailSpecification,
} from './index.styled';

const productSpecification = [
  {
    id: 1,
    title: 'Brand',
    desc: 'JBL',
  },
  {
    id: 2,
    title: 'Model Number',
    desc: 'SH12',
  },
  {
    id: 3,
    title: 'Color',
    desc: 'Red',
  },
  {
    id: 4,
    title: 'Headphone Type',
    desc: 'Wireless over the head',
  },
  {
    id: 5,
    title: 'Inline Remote',
    desc: 'No',
  },
  {
    id: 6,
    title: 'Sales Package',
    desc: '1 SH12 HEADPHONE',
  },
  {
    id: 7,
    title: 'Connectivity',
    desc: 'Bluetooth',
  },
];

const ProductSpecification = () => {
  return (
    <StyledProductDetailSpecification>
      <StyledProductDetailItemTitle>Specification</StyledProductDetailItemTitle>
      <AppRowContainer>
        {productSpecification.map((data, index) => (
          <React.Fragment key={index}>
            <Col xs={8}>
              <p className='text-secondary'> {data.title}</p>
            </Col>
            <Col xs={16}>
              <p> {data.desc}</p>
            </Col>
          </React.Fragment>
        ))}
      </AppRowContainer>
    </StyledProductDetailSpecification>
  );
};

export default ProductSpecification;
