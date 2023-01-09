import React, { useEffect, useState } from 'react';
import AppsHeader from '@crema/components/AppsHeader';
import AppsContent from '@crema/components/AppsContent';
import {
  StyledProductListMainContent,
  StyledProductListView,
} from './index.styled';
import PropTypes from 'prop-types';
import { VIEW_TYPE } from '../index';
import {
  ProductGrid,
  ProductHeader,
  ProductList,
} from '@crema/modules/ecommerce/Products';
import { useDispatch, useSelector } from 'react-redux';
import { onGetEcommerceData } from '../../../../redux/actions';

const ProductListing = ({
  filterData,
  viewType,
  setViewType,
  setFilterData,
}) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const { ecommerceList } = useSelector(({ ecommerce }) => ecommerce);
  const { list = [], total = 0 } = ecommerceList;
  const { loading } = useSelector(({ common }) => common);

  const searchProduct = (title) => {
    setFilterData({ ...filterData, title });
  };

  const onPageChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    dispatch(onGetEcommerceData({ filterData, page }));
  }, [dispatch, filterData]);

  return (
    <StyledProductListView>
      <AppsHeader>
        <ProductHeader
          viewType={viewType}
          onChange={searchProduct}
          setViewType={setViewType}
          page={page}
          totalProducts={total}
          onPageChange={onPageChange}
        />
      </AppsHeader>

      <AppsContent>
        <StyledProductListMainContent>
          {viewType === VIEW_TYPE.GRID ? (
            <ProductGrid ecommerceList={list} loading={loading} />
          ) : (
            <ProductList ecommerceList={list} loading={loading} />
          )}
        </StyledProductListMainContent>
      </AppsContent>
    </StyledProductListView>
  );
};

export default ProductListing;

ProductListing.propTypes = {
  filterData: PropTypes.object,
  viewType: PropTypes.string,
  setViewType: PropTypes.func,
  setFilterData: PropTypes.func,
};
