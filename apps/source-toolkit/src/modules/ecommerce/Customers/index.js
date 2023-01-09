import React, { useEffect, useState } from 'react';
import AppsContainer from '@crema/components/AppsContainer';
import { useIntl } from 'react-intl';
import AppsHeader from '@crema/components/AppsHeader';
import AppsContent from '@crema/components/AppsContent';
import AppInfoView from '@crema/components/AppInfoView';
import { Input, Button, Modal } from 'antd';
import AppPageMeta from '@crema/components/AppPageMeta';
import {
  StyledCustomerFooterPagination,
  StyledCustomerHeader,
  StyledCustomerHeaderPagination,
  StyledCustomerHeaderRight,
  StyledCustomerInputView,
} from './index.styled';
import {
  CustomerTable,
  EditCustomer,
} from '@crema/modules/ecommerce/Customers';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomers } from '../../../toolkit/actions';

const Customers = () => {
  const { messages } = useIntl();
  const dispatch = useDispatch();
  const { customers, customerCount } = useSelector(
    ({ ecommerce }) => ecommerce,
  );
  const { loading } = useSelector(({ common }) => common);

  const [page, setPage] = useState(1);
  const [search, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onChange = (page) => {
    setPage(page);
  };
  useEffect(() => {
    dispatch(getCustomers(search, page));
  }, [dispatch, search, page]);

  const onSearchOrder = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <AppPageMeta title='Customers' />
      <AppsContainer
        title={messages['sidebar.ecommerce.customers']}
        fullView
        type='bottom'
      >
        <AppsHeader key={'wrap'}>
          <StyledCustomerHeader>
            <StyledCustomerInputView>
              <Input
                id='user-name'
                placeholder='Search'
                type='search'
                onChange={onSearchOrder}
              />
            </StyledCustomerInputView>
            <StyledCustomerHeaderRight>
              <Button type='primary' onClick={showModal}>
                Add Customer
              </Button>

              <StyledCustomerHeaderPagination
                pageSize={10}
                count={customerCount}
                page={page}
                onChange={onChange}
              />
            </StyledCustomerHeaderRight>
          </StyledCustomerHeader>
        </AppsHeader>

        <AppsContent
          key={'wrap1'}
          style={{
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <CustomerTable loading={loading} customers={customers} />
        </AppsContent>

        <StyledCustomerFooterPagination
          key={'wrap2'}
          pageSize={10}
          count={customerCount}
          page={page}
          onChange={onChange}
        />
      </AppsContainer>

      <Modal
        title={messages['ecommerce.addCustomer']}
        open={isModalVisible}
        onOk={handleOk}
        footer={false}
        onCancel={handleCancel}
      >
        <EditCustomer />
      </Modal>

      <AppInfoView />
    </>
  );
};

export default Customers;
