import React from 'react';
import { aboutUsData } from '@crema/fakedb/data';
import AppRowContainer from '@crema/components/AppRowContainer';
import { Col } from 'antd';
import AppPageMeta from '@crema/components/AppPageMeta';

import {
  Introduction,
  Sections,
  Team,
} from '@crema/modules/extraPages/AboutUs';

const AboutUs = () => {
  const brandingData = aboutUsData.find((about) => about.alias === 'branding');
  const photoGraphyData = aboutUsData.find(
    (about) => about.alias === 'photography',
  );
  const seoData = aboutUsData.find((about) => about.alias === 'seo');

  return (
    <AppRowContainer type='bottom'>
      <AppPageMeta title='About us' />
      <Col xs={24} md={24} key='a'>
        <Introduction />
      </Col>

      <Col xs={24} lg={8} key='b'>
        <Sections data={brandingData} />
      </Col>

      <Col xs={24} lg={8} key='c'>
        <Sections data={photoGraphyData} />
      </Col>

      <Col xs={24} lg={8} key='d'>
        <Sections data={seoData} />
      </Col>

      <Col xs={24} md={24} key='e'>
        <Team />
      </Col>
    </AppRowContainer>
  );
};

export default AboutUs;
