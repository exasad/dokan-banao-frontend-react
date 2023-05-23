import React from 'react';
import AppCard from '@crema/components/AppCard';
import AppRowContainer from '@crema/components/AppRowContainer';
import { Button, Col, Divider, Form, Input, Typography } from 'antd';
import { StyledFormWrapper } from '../index.styled';
import { useIntl } from 'react-intl';

const AddClient = ({ selectedClient, onSave }) => {
  const { messages } = useIntl();

  return (
    <AppCard
      title={selectedClient ? 'Edit Client' : 'Add Client'}
      style={{ width: '70%', margin: 'auto' }}
    >
      <Form
        initialValues={
          selectedClient
            ? selectedClient
            : {
                name: '',
                firstName: '',
                lastName: '',
                mail: '',
                phone: '',
                vatId: '',
                taxId: '',
                steetName: '',
                zipCode: '',
                city: '',
                state: '',
                country: '',
              }
        }
        onFinish={(data) => {
          let id;
          if (selectedClient) id = selectedClient.id;
          else id = data.name.split(' ')[0].toLowerCase();
          onSave({ ...data, id });
        }}
      >
        <StyledFormWrapper>
          <Form.Item
            name='name'
            rules={[
              {
                required: true,
                message: messages['validation.nameRequired'],
              },
            ]}
          >
            <Input placeholder='Client Name' />
          </Form.Item>

          <Typography.Title level={4} style={{ marginTop: 16 }}>
            Contact Person
          </Typography.Title>
          <Divider style={{ marginTop: 16, marginBottom: 16 }} />
          <AppRowContainer>
            <Col xs={24} md={12}>
              <Form.Item
                name='firstName'
                rules={[
                  {
                    required: true,
                    message: messages['validation.firstNameRequired'],
                  },
                ]}
              >
                <Input placeholder='First Name' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='lastName'
                rules={[
                  {
                    required: true,
                    message: messages['validation.lastNameRequired'],
                  },
                ]}
              >
                <Input placeholder='Last Name' />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name='mail'
                rules={[
                  {
                    required: true,
                    message: messages['validation.emailRequired'],
                  },
                ]}
              >
                <Input type='email' placeholder='Email' />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name='phone'
                rules={[
                  {
                    required: true,
                    message: messages['validation.phoneRequired'],
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (!/^[0-9]{10}$/.test(value)) {
                        return Promise.reject('Enter a valid phone number!');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder='Phone Number' />
              </Form.Item>
            </Col>
          </AppRowContainer>
          <Typography.Title level={4} style={{ marginTop: 16 }}>
            Settings
          </Typography.Title>
          <Divider style={{ marginTop: 16, marginBottom: 16 }} />
          <AppRowContainer>
            <Col xs={24} md={12}>
              <Form.Item
                name='vatId'
                rules={[
                  {
                    required: false,
                    message: messages['validation.vatIdRequired'],
                  },
                ]}
              >
                <Input placeholder='VAT ID' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='taxId'
                rules={[
                  {
                    required: false,
                    message: messages['validation.taxIdRequired'],
                  },
                ]}
              >
                <Input placeholder='Tax ID' />
              </Form.Item>
            </Col>
          </AppRowContainer>
          <Typography.Title level={4} style={{ marginTop: 16 }}>
            Billing Address
          </Typography.Title>
          <Divider style={{ marginTop: 16, marginBottom: 16 }} />
          <AppRowContainer>
            <Col xs={24}>
              <Form.Item
                name='steetName'
                rules={[
                  {
                    required: true,
                    message: messages['validation.steetNameRequired'],
                  },
                ]}
              >
                <Input placeholder='Street Name/Number' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='zipCode'
                rules={[
                  {
                    required: true,
                    message: messages['validation.zipCodeRequired'],
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (!/^[0-9]{6}$/.test(value)) {
                        return Promise.reject('Enter a valid zip code!');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder='Zip Code' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='city'
                rules={[
                  {
                    required: true,
                    message: messages['validation.cityRequired'],
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (!/^[A-Za-z]+$/.test(value)) {
                        return Promise.reject('Enter a valid city!');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder='City' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='state'
                rules={[
                  {
                    required: true,
                    message: messages['validation.stateRequired'],
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (!/^[A-Za-z]+$/.test(value)) {
                        return Promise.reject('Enter a valid state!');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder='State' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='country'
                rules={[
                  {
                    required: true,
                    message: messages['validation.countryRequired'],
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.resolve();
                      }
                      if (!/^[A-Za-z]+$/.test(value)) {
                        return Promise.reject('Enter a valid country!');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input placeholder='Country' />
              </Form.Item>
            </Col>
          </AppRowContainer>
        </StyledFormWrapper>
        <Button
          style={{ display: 'block', marginLeft: 'auto', marginTop: 24 }}
          htmlType='submit'
          type='primary'
        >
          {selectedClient ? 'Edit' : 'Add'} Client
        </Button>
      </Form>
    </AppCard>
  );
};

export default AddClient;
