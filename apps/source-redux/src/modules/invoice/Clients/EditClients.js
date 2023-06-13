import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddClient } from '@crema/modules/invoice';
import { isEmptyObject } from '@crema/helpers';
import { StyledTypographyWrapper } from '../index.styled';
import { useDispatch, useSelector } from 'react-redux';
import { onGetClientDetail, onUpdateClient } from '../../../redux/actions';
import AppLoader from '@crema/components/AppLoader';

const EditClients = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedClient = useSelector(
    ({ invoiceApp }) => invoiceApp.selectedClient,
  );
  const { loading } = useSelector(({ common }) => common);

  useEffect(() => {
    dispatch(onGetClientDetail(id));
  }, [dispatch, id]);

  const onSave = (client) => {
    dispatch(onUpdateClient(client));
    navigate('/invoice/clients');
  };

  return loading ? (
    <AppLoader />
  ) : (
    !isEmptyObject(selectedClient) && (
      <StyledTypographyWrapper>
        <AddClient selectedClient={selectedClient} onSave={onSave} />
      </StyledTypographyWrapper>
    )
  );
};

export default EditClients;
