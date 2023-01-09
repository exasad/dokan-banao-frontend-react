import React, { useState } from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import PropTypes from 'prop-types';
import { AiOutlineDelete } from 'react-icons/ai';
import { Dropdown } from 'antd';
import { MdLabelOutline } from 'react-icons/md';
import AppIconButton from '@crema/components/AppIconButton';
import { StyledContactCheckedAction } from '../index.styled';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { onUpdateContactLabel } from '../../../../../toolkit/actions';

const ContactCheckedActions = ({
  checkedContacts,
  setCheckedContacts,
  onSelectContactsForDelete,
}) => {
  const [isLabelOpen, onOpenLabel] = useState(false);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const onLabelOpen = () => {
    onOpenLabel(true);
  };

  const onLabelClose = () => {
    onOpenLabel(false);
  };

  const onSelectLabel = (key) => {
    const path = pathname.split('/');
    dispatch(
      onUpdateContactLabel(checkedContacts, +key, path[path.length - 2]),
    );
    setCheckedContacts([]);
    onLabelClose();
  };

  const items = [
    {
      key: 1,
      label: (
        <span key={311} onClick={() => onSelectLabel(311)}>
          <IntlMessages id='common.crema' />
        </span>
      ),
    },
    {
      key: 2,
      label: (
        <span key={312} onClick={() => onSelectLabel(312)}>
          <IntlMessages id='common.personal' />
        </span>
      ),
    },
    {
      key: 3,
      label: (
        <span key={313} onClick={() => onSelectLabel(313)}>
          <IntlMessages id='common.work' />
        </span>
      ),
    },
  ];

  return (
    <StyledContactCheckedAction>
      <AppIconButton
        icon={<AiOutlineDelete />}
        title={<IntlMessages id='common.delete' />}
        onClick={() => onSelectContactsForDelete(checkedContacts)}
      />

      <Dropdown
        onClick={onLabelOpen}
        open={isLabelOpen}
        menu={{ items }}
        trigger={['click']}
      >
        <AppIconButton
          icon={<MdLabelOutline />}
          title={<IntlMessages id='common.label' />}
        />
      </Dropdown>
    </StyledContactCheckedAction>
  );
};

export default ContactCheckedActions;

ContactCheckedActions.propTypes = {
  checkedContacts: PropTypes.array.isRequired,
  setCheckedContacts: PropTypes.func,
  onSelectContactsForDelete: PropTypes.func,
  onUpdateContacts: PropTypes.func,
};
