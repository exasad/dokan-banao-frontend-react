import React, { useState } from 'react';
import AppRowContainer from '@crema/components/AppRowContainer';
import { Button, Col, Divider, Form, Input, Space, Typography } from 'antd';
import { MdEdit } from 'react-icons/md';
import {
  StyledSecondaryText,
  StyledSecondaryText1,
  StyledShadowWrapper,
} from '../index.styled';

const General = ({ settings, onUpdateSettings }) => {
  const [isEdit, setIsEdit] = useState(false);
  console.log('settings', settings);
  return (
    <Form
      initialValues={settings}
      onFinish={(data) => {
        onUpdateSettings('general', data);
        setIsEdit(false);
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Typography.Title level={4}>General Settings</Typography.Title>
          <StyledSecondaryText>
            Manage your general account settings
          </StyledSecondaryText>
        </div>
        <div>
          {!isEdit && (
            <MdEdit
              size={25}
              style={{ cursor: 'pointer' }}
              onClick={() => setIsEdit(true)}
            />
          )}
        </div>
      </div>
      <Divider style={{ marginTop: 16, marginBottom: 16 }} />
      <AppRowContainer>
        <Col xs={24} md={6}>
          <Typography.Title level={5}>Account Info</Typography.Title>
          <StyledSecondaryText1>
            Update your account details.
          </StyledSecondaryText1>
        </Col>
        <Col xs={24} md={18}>
          <StyledShadowWrapper>
            <AppRowContainer>
              <Col xs={24} md={12}>
                <Form.Item name='accountType'>
                  <Input placeholder='Account type' readOnly={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='agencyName'>
                  <Input placeholder='Agency Name' readOnly={!isEdit} />
                </Form.Item>
              </Col>
            </AppRowContainer>
          </StyledShadowWrapper>
        </Col>
      </AppRowContainer>
      <Divider style={{ marginTop: 16, marginBottom: 16 }} />
      <AppRowContainer>
        <Col xs={24} md={6}>
          <Typography.Title level={5}>System</Typography.Title>
          <StyledSecondaryText1>
            Update your system information.
          </StyledSecondaryText1>
        </Col>
        <Col xs={24} md={18}>
          <StyledShadowWrapper>
            <AppRowContainer>
              <Col xs={24} md={12}>
                <Form.Item name='language'>
                  <Input placeholder='Language' readOnly={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='dateFormat'>
                  <Input placeholder='Date Format' readOnly={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='currency'>
                  <Input placeholder='Default Currency' readOnly={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='decimalSeparator'>
                  <Input placeholder='Decimal Separator' readOnly={!isEdit} />
                </Form.Item>
              </Col>
            </AppRowContainer>
          </StyledShadowWrapper>
        </Col>
      </AppRowContainer>
      <AppRowContainer style={{ marginTop: 32, marginBottom: 32 }}>
        <Col xs={24} md={6}>
          <Typography.Title level={5}>Address</Typography.Title>
          <StyledSecondaryText1>
            Update your address details.
          </StyledSecondaryText1>
        </Col>
        <Col xs={24} md={18}>
          <StyledShadowWrapper>
            <AppRowContainer>
              <Col xs={24}>
                <Form.Item name='street'>
                  <Input placeholder='Street/Number' readOnly={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='zipCode'>
                  <Input placeholder='Zip Code' readOnly={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='city'>
                  <Input placeholder='City' readOnly={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='state'>
                  <Input placeholder='State' readOnly={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='country'>
                  <Input placeholder='Country' readOnly={!isEdit} />
                </Form.Item>
              </Col>
            </AppRowContainer>
          </StyledShadowWrapper>
        </Col>
      </AppRowContainer>
      <Divider style={{ marginTop: 16, marginBottom: 16 }} />
      <AppRowContainer>
        <Col xs={24} md={6}>
          <Typography.Title level={5}>Contact info</Typography.Title>
          <StyledSecondaryText1>
            Update your contact details.
          </StyledSecondaryText1>
        </Col>
        <Col xs={24} md={18}>
          <StyledShadowWrapper>
            <AppRowContainer>
              <Col xs={24} md={12}>
                <Form.Item name='phoneNumber'>
                  <Input placeholder='Phone Number' readOnly={!isEdit} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='alternateNumber'>
                  <Input placeholder='Alternate Number' readOnly={!isEdit} />
                </Form.Item>
              </Col>
            </AppRowContainer>
          </StyledShadowWrapper>
        </Col>
      </AppRowContainer>
      {isEdit && (
        <Space
          size={15}
          style={{ display: 'flex', marginTop: 12, justifyContent: 'flex-end' }}
        >
          <Button onClick={() => setIsEdit(false)}>Cancel</Button>
          <Button type='primary' htmlType='submit'>
            Save
          </Button>
        </Space>
      )}
    </Form>
  );
};

export default General;
