import React, { useEffect } from 'react';
import MailsList from './MailsList';
import MailDetail from './MailDetail';
import PropTypes from 'prop-types';
import AppsContainer from '@crema/components/AppsContainer';
import MailSidebar from './MailSideBar';
import { useIntl } from 'react-intl';
import AppPageMeta from '@crema/components/AppPageMeta';
import { useParams } from 'react-router-dom';
import {
  onGetConnectionList,
  onGetMailFolderList,
  onGetMailLabelList,
} from '../../../redux/actions';
import { useDispatch } from 'react-redux';

const Mail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetMailLabelList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetMailFolderList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetConnectionList());
  }, [dispatch]);

  const onGetMainComponent = () => {
    if (id) {
      return <MailDetail />;
    } else {
      return <MailsList />;
    }
  };

  const { messages } = useIntl();
  return (
    <AppsContainer
      title={messages['mailApp.mail']}
      sidebarContent={<MailSidebar />}
    >
      <AppPageMeta title='Mail App' />
      {onGetMainComponent()}
    </AppsContainer>
  );
};

export default Mail;

Mail.defaultProps = {
  match: null,
};

Mail.propTypes = {
  match: PropTypes.object,
};
