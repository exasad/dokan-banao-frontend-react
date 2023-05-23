import React, { useEffect, useState } from 'react';
import InvContentHeader from './InvContentHeader';
import AppsHeader from '@crema/components/AppsHeader';
import AppsContent from '@crema/components/AppsContent';
import { InvoiceTable } from '@crema/modules/invoice';
import { useLocation, useParams } from 'react-router-dom';
import { isEmptyObject } from '@crema/helpers';
import AppLoader from '@crema/components/AppLoader';
import { useDispatch, useSelector } from 'react-redux';
import { onGetInvoiceList, onUpdateInvoice } from '../../../../redux/actions';

const InvoiceList = () => {
  const params = useParams();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const loading = useSelector(({ common }) => common.loading);
  const invoiceList = useSelector(({ invoiceApp }) => invoiceApp.invoiceList);

  const [page, setPage] = useState(0);

  const onPageChange = (event, value) => {
    setPage(value);
  };
  const [filterText, onSetFilterText] = useState('');

  const [checkedInvs, setCheckedInvs] = useState([]);

  useEffect(() => {
    dispatch(onGetInvoiceList({ folder: params?.folder, page: page }));
  }, [dispatch, page, pathname]);

  const onChangeStatus = (invoice, status) => {
    invoice.folderValue = status;

    dispatch(onUpdateInvoice(invoice));
  };

  return !isEmptyObject(invoiceList) ? (
    <>
      <AppsHeader>
        <InvContentHeader
          page={page}
          invoiceList={invoiceList || []}
          checkedInvs={checkedInvs}
          setCheckedInvs={setCheckedInvs}
          filterText={filterText}
          onSetFilterText={onSetFilterText}
          onPageChange={onPageChange}
        />
      </AppsHeader>
      <AppsContent>
        <InvoiceTable
          invoiceData={invoiceList || []}
          loading={loading}
          onChangeStatus={onChangeStatus}
        />
      </AppsContent>
    </>
  ) : (
    <AppLoader />
  );
};

export default InvoiceList;
