import React, { useEffect } from 'react';
import ContactListing from './ContactListing';
import { useIntl } from 'react-intl';
import AppsContainer from '@crema/components/AppsContainer';
import SideBarContent from './ContactSideBar';
import AppPageMeta from '@crema/components/AppPageMeta';
import { useDispatch } from 'react-redux';
import { onGetFolderList, onGetLabelList } from '../../../toolkit/actions';

const Contact = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetFolderList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetLabelList());
  }, [dispatch]);

  const { messages } = useIntl();
  return (
    <AppsContainer
      title={messages['contactApp.contact']}
      sidebarContent={<SideBarContent />}
    >
      <AppPageMeta title='Contact App' />
      <ContactListing />
    </AppsContainer>
  );
};

export default Contact;
