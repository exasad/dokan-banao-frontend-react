import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import CheckBox from './CheckBox';
import ContactCheckedActions from './ContactCheckedActions';
import {
  StyledContactContentHeader,
  StyledContactHeaderPagination,
  StyledContactSearch,
} from '../index.styled';
import { ViewSelectButtons } from '@crema/modules/apps/Contact';
import { useSelector } from 'react-redux';

const ContactHeader = (props) => {
  const {
    checkedContacts,
    setCheckedContacts,
    filterText,
    onSetFilterText,
    onChangePageView,
    onSelectContactsForDelete,
    page,
    onChange,
    pageView,
  } = props;

  const { messages } = useIntl();
  const contactList = useSelector(({ contactApp }) => contactApp.contactList);

  const totalContacts = useSelector(
    ({ contactApp }) => contactApp.totalContacts,
  );

  return (
    <>
      <StyledContactContentHeader>
        <CheckBox
          contactList={contactList || []}
          checkedContacts={checkedContacts}
          setCheckedContacts={setCheckedContacts}
        />

        {checkedContacts.length > 0 ? (
          <ContactCheckedActions
            onSelectContactsForDelete={onSelectContactsForDelete}
            checkedContacts={checkedContacts}
            setCheckedContacts={setCheckedContacts}
          />
        ) : null}

        <StyledContactSearch
          value={filterText}
          onChange={(event) => onSetFilterText(event.target.value)}
          placeholder={messages['common.searchHere']}
        />

        <ViewSelectButtons
          pageView={pageView}
          onChangePageView={onChangePageView}
        />
      </StyledContactContentHeader>
      {contactList.length > 0 ? (
        <StyledContactHeaderPagination
          count={totalContacts}
          page={page}
          onChange={onChange}
        />
      ) : null}
    </>
  );
};

export default ContactHeader;

ContactHeader.defaultProps = {
  checkedContacts: [],
  filterText: '',
  page: 0,
};

ContactHeader.propTypes = {
  checkedContacts: PropTypes.array,
  setCheckedContacts: PropTypes.func,
  filterText: PropTypes.string,
  onSetFilterText: PropTypes.func,
  onSelectContactsForDelete: PropTypes.func,
  page: PropTypes.number,
  apiData: PropTypes.any,
  onChange: PropTypes.func,
  pageView: PropTypes.string.isRequired,
  onChangePageView: PropTypes.func,
  onUpdateContacts: PropTypes.func,
};
