import React from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import {
  StyledAboutSectionCard,
  StyledAboutSectionThumb,
  StyledSectionAvatar,
} from './index.styled';

const Sections = ({ data }) => {
  return (
    <StyledAboutSectionCard>
      <StyledAboutSectionThumb>
        <StyledSectionAvatar
          style={{
            backgroundColor: data.avatarColor,
          }}
        >
          {data.icon}
        </StyledSectionAvatar>
      </StyledAboutSectionThumb>

      <h2>{data.title}</h2>

      <p>{data.content}</p>

      <Button className='btn-white read-btn'>
        <IntlMessages id='dashboard.readMore' />
      </Button>
    </StyledAboutSectionCard>
  );
};

export default Sections;

Sections.propTypes = {
  data: PropTypes.object.isRequired,
};
