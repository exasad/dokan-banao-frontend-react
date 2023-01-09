import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import {
  StyledAnChar,
  StyledBadgeRoot,
  StyledOrderTable,
} from '../index.styled';

const OrderTable = ({ orderData }) => {
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending': {
        return '#F84E4E';
      }
      case 'Delivered': {
        return '#43C888';
      }
      default: {
        return '#E2A72E';
      }
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <StyledAnChar>{id}</StyledAnChar>,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Delivery Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <StyledBadgeRoot
          style={{
            color: getPaymentStatusColor(status),
            backgroundColor: getPaymentStatusColor(status) + '44',
          }}
        >
          {status}
        </StyledBadgeRoot>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Button key={id} shape='circle' icon={<MoreOutlined />} />
      ),
    },
  ];
  return <StyledOrderTable data={orderData} columns={columns} />;
};

export default OrderTable;

OrderTable.defaultProps = {
  orderData: [],
};

OrderTable.propTypes = {
  orderData: PropTypes.array,
};
