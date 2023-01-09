import React from 'react';
import ProductSpecification from './ProductSpecification';
import ProductInfo from './ProductInfo';
import DeliveryInfo from './DeliveryInfo';
import Reviews from './Reviews';
import AvailableOffers from './AvailableOffers';
import PropTypes from 'prop-types';
import { Divider } from 'antd';
import {
  StyledProductView,
  StyledProductViewTitle,
  StyledStrokeSubtitle,
} from './index.styled';

const ProductView = ({ product }) => {
  return (
    <StyledProductView>
      <StyledProductViewTitle>
        ${product.mrp}
        <span className='line-through'>
          ${+product.mrp - +product.discount}
        </span>
      </StyledProductViewTitle>
      <StyledStrokeSubtitle>In stock</StyledStrokeSubtitle>
      <p className='text-secondary mb-0'>
        It is a long established fact that a reader will be distracted by the
        readable content of a page looking at its layout. The point of using
        Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using Content here, content here, making it look
        like readable English. Many desktop publishing packages and web page
        editors now use..
      </p>
      <Divider style={{ marginTop: 15, marginBottom: 15 }} />
      <AvailableOffers />
      <DeliveryInfo />
      <Divider style={{ marginTop: 15, marginBottom: 15 }} />
      <ProductSpecification />
      <Divider style={{ marginTop: 15, marginBottom: 15 }} />
      <ProductInfo />
      <Divider style={{ marginTop: 15, marginBottom: 15 }} />
      <Reviews />
    </StyledProductView>
  );
};

export default ProductView;

ProductView.propTypes = {
  product: PropTypes.object,
};
