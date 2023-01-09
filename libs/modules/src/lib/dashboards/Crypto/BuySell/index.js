import React from 'react';
import TabForm from './TabForm';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import IntlMessages from '@crema/helpers/IntlMessages';
import { StyledBuyCellCard } from './index.styled';

const BuySell = ({ buySell }) => {
  const items = [
    { label: 'Buy', key: '1', children: <TabForm data={buySell.buyData} /> }, // remember to pass the key prop
    { label: 'Sell', key: '2', children: <TabForm data={buySell.sellData} /> },
  ];
  return (
    <StyledBuyCellCard
      heightFull
      actions={[
        <a href='#' key={1}>
          <IntlMessages id='dashboard.buyNow' />
        </a>,
      ]}
    >
      <Tabs defaultActiveKey='1' items={items}></Tabs>
    </StyledBuyCellCard>
  );
};

export default BuySell;

BuySell.defaultProps = {
  buySell: {
    buyData: {
      value: '',
      price: '',
      amount: '',
    },
    sellData: {
      value: '',
      price: '',
      amount: '',
    },
  },
};

BuySell.propTypes = {
  buySell: PropTypes.object,
};
