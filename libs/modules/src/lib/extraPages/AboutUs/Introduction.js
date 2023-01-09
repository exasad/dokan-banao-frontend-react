import React from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Button } from 'antd';
import {
  StyledAboutBtnView,
  StyledAboutImage,
  StyledAboutImgContent,
  StyledAboutIntroCard,
  StyledAboutReadButton,
  StyledImageAboutView,
} from './index.styled';

const Introduction = () => {
  return (
    <StyledAboutIntroCard>
      <StyledImageAboutView>
        <StyledAboutImage>
          <img
            src={'/assets/images/AboutUs.png'}
            alt='about us'
            title='aboutUs'
          />
        </StyledAboutImage>
        <StyledAboutImgContent>
          <h2>
            <IntlMessages id='extra.aboutUs' />
          </h2>
          <p>
            <IntlMessages id='extra.aboutContent' />
          </p>
          <StyledAboutBtnView>
            <Button type='primary' className='btn'>
              <IntlMessages id='extra.contactUs' />
            </Button>
            <StyledAboutReadButton className='btn'>
              <IntlMessages id='dashboard.readMore' />
            </StyledAboutReadButton>
          </StyledAboutBtnView>
        </StyledAboutImgContent>
      </StyledImageAboutView>
    </StyledAboutIntroCard>
  );
};

export default Introduction;
