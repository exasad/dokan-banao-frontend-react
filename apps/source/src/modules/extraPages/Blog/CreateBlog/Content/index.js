import React from 'react';
import AppCard from '@crema/components/AppCard';
import ImgUpload from './ImageUpload';
import { StyledFormWrapper, StyledText, StyledTextarea } from '../index.styled';
import { Col, Form, Input } from 'antd';

const { TextArea } = Input;

const BlogContent = ({ uploadedFiles, setUploadedFiles }) => {
  return (
    <Col xs={24} lg={16}>
      <AppCard>
        <StyledFormWrapper>
          <Form.Item name='title'>
            <Input placeholder='Blog Name' />
          </Form.Item>

          <StyledText>Description*</StyledText>
          <Form.Item name='description'>
            <TextArea rows={4} placeholder='Description here' />
          </Form.Item>

          <StyledText>Content*</StyledText>

          <Form.Item name='content'>
            <StyledTextarea theme='snow' placeholder='Description here' />
          </Form.Item>
          <StyledText>Cover Image</StyledText>
          <ImgUpload
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        </StyledFormWrapper>
      </AppCard>
    </Col>
  );
};

export default BlogContent;
