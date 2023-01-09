import React, { useEffect, useState } from 'react';
import AppsContainer from '@crema/components/AppsContainer';
import { useIntl } from 'react-intl';
import AppsHeader from '@crema/components/AppsHeader';
import AppsContent from '@crema/components/AppsContent';
import AppInfoView from '@crema/components/AppInfoView';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import AppPageMeta from '@crema/components/AppPageMeta';
import {
  StyledOrderFooterPagination,
  StyledOrderHeader,
  StyledOrderHeaderInputView,
  StyledOrderHeaderPagination,
  StyledOrderHeaderRight,
} from './index.styled';
import { StyledLinkBtn } from '../Confirmation/index.styled';
import { OrderTable } from '@crema/modules/ecommerce/Orders';
import { useDispatch, useSelector } from 'react-redux';
import { getRecentOrders } from '../../../toolkit/actions';

const Orders = () => {
  const { messages } = useIntl();
  const [page, setPage] = useState(1);
  const [search, setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const { recentOrders, orderCount } = useSelector(
    ({ ecommerce }) => ecommerce,
  );
  const { loading } = useSelector(({ common }) => common);

  const onChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    dispatch(getRecentOrders(search, page));
  }, [dispatch, search, page]);

  const onSearchOrder = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  return (
    <>
      <AppPageMeta title='Orders' />
      <AppsContainer
        title={messages['eCommerce.recentOrders']}
        type='bottom'
        fullView
      >
        <AppsHeader>
          <StyledOrderHeader>
            <StyledOrderHeaderInputView>
              <Input
                id='user-name'
                placeholder='Search'
                type='search'
                onChange={onSearchOrder}
              />
            </StyledOrderHeaderInputView>
            <StyledOrderHeaderRight>
              <StyledLinkBtn type='primary'>
                <Link to='/ecommerce/products'>Continue Shopping</Link>
              </StyledLinkBtn>

              <StyledOrderHeaderPagination
                pageSize={10}
                count={orderCount}
                page={page}
                onChange={onChange}
              />
            </StyledOrderHeaderRight>
          </StyledOrderHeader>
        </AppsHeader>

        <AppsContent
          style={{
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <OrderTable loading={loading} orderData={recentOrders || []} />
        </AppsContent>

        <StyledOrderFooterPagination
          pageSize={10}
          count={orderCount}
          page={page}
          onChange={onChange}
        />
      </AppsContainer>
      <AppInfoView />
    </>
  );
};

export default Orders;
