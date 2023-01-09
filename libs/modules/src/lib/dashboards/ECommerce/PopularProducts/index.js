import React from 'react';
import AppCard from '@crema/components/AppCard';
import ProductCell from './ProductCell';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { StyledPopularScrollbar, StyledPowerGrid } from './index.styled';

const PopularProducts = ({ popularProducts }) => {
  const { messages } = useIntl();
  return (
    <AppCard
      className='no-card-space-ltr-rtl'
      title={messages['eCommerce.popularProducts']}
    >
      <StyledPopularScrollbar>
        <StyledPowerGrid
          dataSource={popularProducts}
          renderItem={(data, index) => (
            <ProductCell key={'product-' + index} data={data} />
          )}
        />
      </StyledPopularScrollbar>
    </AppCard>
  );
};

export default PopularProducts;

PopularProducts.propTypes = {
  popularProducts: PropTypes.array,
};
