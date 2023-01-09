import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ContactHeader from './ContactHeader';
import IntlMessages from '@crema/helpers/IntlMessages';
import CreateContact from '../CreateContact';
import ContactViewContent from './ContactViewContent';
import ContactDetail from '../ContactDetail';
import AppsPagination from '@crema/components/AppsPagination';
import AppsHeader from '@crema/components/AppsHeader';
import AppsContent from '@crema/components/AppsContent';
import ConfirmationModal from '@crema/components/AppConfirmationModal';
import { StyledAppFooter } from './index.styled';
import { postDataApi, putDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/InfoViewContextProvider';

const ContactListing = ({
  apiData,
  loading,
  setQueryParams,
  setData,
  reCallAPI,
}) => {
  const { pathname } = useLocation();
  const infoViewActionsContext = useInfoViewActionsContext();

  const [filterText, onSetFilterText] = useState('');

  const [page, setPage] = useState(0);

  const [pageView, setPageView] = useState('list');

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [checkedContacts, setCheckedContacts] = useState([]);

  const [toDeleteContacts, setToDeleteContacts] = useState([]);

  const [isAddContact, onSetIsAddContact] = useState(false);

  const [isShowDetail, onShowDetail] = useState(false);

  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    setPage(0);
  }, [pathname]);

  useEffect(() => {
    const path = pathname.split('/');
    setQueryParams({
      type: path[path.length - 2],
      name: path[path.length - 1],
      page: page,
    });
  }, [pathname, pageView, page]);

  const handleAddContactOpen = () => {
    onSetIsAddContact(true);
  };

  const handleAddContactClose = () => {
    onSetIsAddContact(false);
  };

  const onViewContactDetail = (contact) => {
    setSelectedContact(contact);
    onShowDetail(true);
  };

  const onOpenEditContact = (contact) => {
    setSelectedContact(contact);
    handleAddContactOpen();
  };

  const onChange = (page) => {
    setPage(page);
  };

  const onChangePageView = (view) => {
    setPageView(view);
  };

  const onChangeCheckedContacts = (checked, id) => {
    if (checked) {
      setCheckedContacts(checkedContacts.concat(id));
    } else {
      setCheckedContacts(
        checkedContacts.filter((contactId) => contactId !== id),
      );
    }
  };

  const onChangeStarred = (status, contact) => {
    putDataApi('/api/contactApp/update/starred', infoViewActionsContext, {
      contactIds: [contact.id],
      status: status,
    })
      .then((data) => {
        onUpdateSelectedContact(data[0]);
        infoViewActionsContext.showMessage(
          data[0].isStarred
            ? 'Contact Marked as Starred Successfully'
            : 'Contact Marked as Unstarred Successfully',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  const onUpdateSelectedContact = (contact) => {
    setData({
      data: apiData?.data.map((item) => {
        if (item.id === contact.id) {
          return contact;
        }
        return item;
      }),
      count: apiData?.count,
    });
  };

  const onUpdateContact = (contact) => {
    setSelectedContact(contact);
    handleAddContactClose();
  };

  const onUpdateContacts = (contacts) => {
    console.log(
      apiData?.data.map((item) => {
        const contact = contacts.find((contact) => contact.id === item.id);
        if (contact) {
          return contact;
        }
        return item;
      }),
    );
    setData({
      data: apiData?.data.map((item) => {
        const contact = contacts.find((contact) => contact.id === item.id);
        if (contact) {
          return contact;
        }
        return item;
      }),
      count: apiData?.count,
    });
  };

  const onGetFilteredItems = () => {
    if (filterText === '') {
      return apiData?.data;
    } else {
      return apiData?.data.filter((contact) =>
        contact.name.toUpperCase().includes(filterText.toUpperCase()),
      );
    }
  };

  const onDeleteSelectedContacts = () => {
    const path = pathname.split('/');
    postDataApi('/api/contactApp/delete/contact', infoViewActionsContext, {
      type: path[path.length - 2],
      name: path[path.length - 1],
      contactIds: toDeleteContacts,
      page,
    })
      .then((data) => {
        setData(data);
        infoViewActionsContext.showMessage('Contact Deleted Successfully');
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });

    setDeleteDialogOpen(false);
    setCheckedContacts([]);
  };

  const onSelectContactsForDelete = (contactIds) => {
    setToDeleteContacts(contactIds);
    setDeleteDialogOpen(true);
  };

  const list = onGetFilteredItems();

  return (
    <>
      <AppsHeader>
        <ContactHeader
          checkedContacts={checkedContacts}
          setCheckedContacts={setCheckedContacts}
          filterText={filterText}
          onSelectContactsForDelete={onSelectContactsForDelete}
          onSetFilterText={onSetFilterText}
          onChange={onChange}
          onUpdateContacts={onUpdateContacts}
          page={page}
          apiData={apiData}
          onChangePageView={onChangePageView}
          pageView={pageView}
        />
      </AppsHeader>
      <AppsContent>
        <ContactViewContent
          list={list}
          loading={loading}
          pageView={pageView}
          handleAddContactOpen={handleAddContactOpen}
          onChangeCheckedContacts={onChangeCheckedContacts}
          onChangeStarred={onChangeStarred}
          checkedContacts={checkedContacts}
          onSelectContactsForDelete={onSelectContactsForDelete}
          onViewContactDetail={onViewContactDetail}
          onOpenEditContact={onOpenEditContact}
        />
      </AppsContent>

      {apiData?.data?.length > 0 ? (
        <StyledAppFooter>
          <AppsPagination
            count={apiData?.count}
            page={page}
            onChange={onChange}
          />
        </StyledAppFooter>
      ) : null}

      {isAddContact ? (
        <CreateContact
          isAddContact={isAddContact}
          handleAddContactClose={handleAddContactClose}
          selectContact={selectedContact}
          onUpdateContact={onUpdateContact}
          reCallAPI={reCallAPI}
        />
      ) : null}

      {isShowDetail ? (
        <ContactDetail
          selectedContact={selectedContact}
          isShowDetail={isShowDetail}
          onShowDetail={onShowDetail}
          onChangeStarred={onChangeStarred}
          onSelectContactsForDelete={onSelectContactsForDelete}
          onOpenEditContact={onOpenEditContact}
        />
      ) : null}

      {isDeleteDialogOpen ? (
        <ConfirmationModal
          open={isDeleteDialogOpen}
          onDeny={setDeleteDialogOpen}
          onConfirm={onDeleteSelectedContacts}
          modalTitle={<IntlMessages id='common.deleteItem' />}
        />
      ) : null}
    </>
  );
};

export default ContactListing;

ContactListing.propTypes = {
  apiData: PropTypes.object,
  loading: PropTypes.bool,
  setQueryParams: PropTypes.func,
  setData: PropTypes.func,
  reCallAPI: PropTypes.func,
};
