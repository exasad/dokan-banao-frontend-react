import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import IntlMessages from '@crema/helpers/IntlMessages';
import { StyledTabForm, StyledTabFormRightText } from './index.styled';

const TabForm = (props) => {
  const { data } = props;

  const [inputValue, setValue] = useState(data.value);
  const [inputPrice, setPrice] = useState(data.price);
  const [inputAmount, setAmount] = useState(data.amount);

  return (
    <>
      <StyledTabForm noValidate autoComplete='off'>
        <div className='form-field'>
          <StyledTabFormRightText>
            <IntlMessages id='dashboard.btc' />
          </StyledTabFormRightText>
          <Input
            value={inputValue}
            onChange={(e) => setValue(e.target.value)}
            placeholder='Value'
          />
        </div>
        <div className='form-field'>
          <StyledTabFormRightText>
            <IntlMessages id='dashboard.btc' />
          </StyledTabFormRightText>
          <Input
            value={inputPrice}
            onChange={(e) => setPrice(e.target.value)}
            placeholder='Price'
          />
        </div>
        <div className='form-field'>
          <StyledTabFormRightText>
            <IntlMessages id='dashboard.btc' />
          </StyledTabFormRightText>
          <Input
            value={inputAmount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder='Amount'
          />
        </div>
      </StyledTabForm>
    </>
  );
};

export default TabForm;

TabForm.defaultProps = {
  data: {
    value: '',
    price: '',
    amount: '',
  },
};

TabForm.propTypes = {
  data: PropTypes.object,
};
