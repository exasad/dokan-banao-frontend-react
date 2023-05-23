import React, { useEffect } from 'react';
import { InvoiceSettings } from '@crema/modules/invoice';
import { StyledTypographyWrapper } from '../index.styled';
import { useDispatch, useSelector } from 'react-redux';
import {
  onGetInvoiceSettings,
  onUpdateSettings,
} from '../../../toolkit/actions';

const InvoiceSettingsPage = () => {
  const dispatch = useDispatch();
  const invoiceSettings = useSelector(
    ({ invoiceApp }) => invoiceApp.invoiceSettings,
  );

  useEffect(() => {
    dispatch(onGetInvoiceSettings());
  }, [dispatch]);

  const updateSettings = (key, newSettings) => {
    const settings = {
      ...invoiceSettings,
      [key]: newSettings,
    };

    dispatch(onUpdateSettings(settings));
  };

  return (
    <StyledTypographyWrapper>
      <InvoiceSettings
        defaultSettings={invoiceSettings}
        onUpdateSettings={updateSettings}
      />
    </StyledTypographyWrapper>
  );
};

export default InvoiceSettingsPage;
