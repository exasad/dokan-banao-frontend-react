import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddClient } from '@crema/modules/invoice';
import { useDispatch } from 'react-redux';
import { onAddClient } from '../../../redux/actions';
import { StyledTypographyWrapper } from '../index.styled';

const AddClients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSave = (client) => {
    dispatch(onAddClient(client));
    navigate('/invoice/clients');
  };

  return (
    <StyledTypographyWrapper>
      <AddClient onSave={onSave} />
    </StyledTypographyWrapper>
  );
};

export default AddClients;
