import React from 'react';
import AppCard from '@crema/components/AppCard';
import ImgUpload from './ImageUpload';
import AppScrollbar from '@crema/components/AppScrollbar';
import { StyledDetailTextarea, StyledText, StyledTextMb } from './index.styled';
import { Form, Col, Input } from 'antd';

const ProductContent = ({ uploadedFiles, setUploadedFiles }) => {
  return (
    <Col xs={24} lg={16}>
      <AppScrollbar style={{ height: '700px' }}>
        <AppCard>
          <Form.Item name='title'>
            <Input placeholder='Product Name' />
          </Form.Item>

          <StyledText>Description*</StyledText>
          <Form.Item name='description'>
            <StyledDetailTextarea theme='snow' placeholder='Description here' />
          </Form.Item>
          <StyledTextMb>Images</StyledTextMb>
          <ImgUpload
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        </AppCard>
      </AppScrollbar>
    </Col>
  );
};

export default ProductContent;
