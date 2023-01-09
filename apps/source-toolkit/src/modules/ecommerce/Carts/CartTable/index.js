import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Table } from 'antd';
import {
  CloseCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  StyledCartIncDec,
  StyledCartTable,
  StyledCartUser,
  StyledCartUserInfo,
} from '../index.styled';
import { useDispatch } from 'react-redux';
import { removeCartItem, updateCartItem } from '../../../../toolkit/actions';

const CartTable = ({ cartItems, loading }) => {
  const dispatch = useDispatch();
  const { Column, ColumnGroup } = Table;

  const onRemoveItem = (product) => {
    dispatch(removeCartItem(product));
  };

  const onDecrement = (product) => {
    if (product.count > 1) {
      dispatch(updateCartItem({ ...product, count: product.count - 1 }));
    } else {
      dispatch(removeCartItem(product));
    }
  };
  const onIncrement = (product) => {
    dispatch(updateCartItem({ ...product, count: product.count + 1 }));
  };

  console.log('cartItems', cartItems);
  return (
    <StyledCartTable
      loading={loading}
      dataSource={cartItems}
      pagination={false}
    >
      <ColumnGroup>
        <Column
          title='Product'
          dataIndex='product'
          key='product'
          render={(product) => {
            console.log('product:', product);
            return (
              <StyledCartUser>
                <Avatar src={product.image} />
                <StyledCartUserInfo>
                  <h3>{product.title}</h3>
                  <p>Brand: {product.brand}</p>
                </StyledCartUserInfo>
              </StyledCartUser>
            );
          }}
        />
        <Column
          title='Unit Price'
          dataIndex='price'
          key='price'
          render={(price) => <>${+price.mrp - +price.discount}</>}
        />
        <Column
          title='QTY'
          dataIndex='count'
          key='count'
          render={(count, record) => (
            <StyledCartIncDec>
              <PlusOutlined
                className='pointer'
                onClick={() => onIncrement(record)}
              />
              <span>{count}</span>
              <MinusOutlined
                className='pointer'
                onClick={() => onDecrement(record)}
              />
            </StyledCartIncDec>
          )}
        />
        <Column
          title='Total'
          dataIndex='total'
          key='total'
          render={(total) => (
            <span>${(+total.mrp - +total.discount) * +total.count}</span>
          )}
        />
        <Column
          title=''
          dataIndex='close'
          key='close'
          render={(_, record) => (
            <span onClick={() => onRemoveItem(record)}>
              <CloseCircleOutlined
                style={{ fontSize: 18, cursor: 'pointer' }}
              />
            </span>
          )}
        />
      </ColumnGroup>
    </StyledCartTable>
  );
};

export default CartTable;

CartTable.propTypes = {
  cartItems: PropTypes.array,
  setTableData: PropTypes.func,
  loading: PropTypes.bool,
};
