import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'antd';
import { StyledHeading, StyledText } from './index.styled.js';

const PeopleCard = ({ data }) => {
  console.log(data);
  return (
    <Card style={{ minHeight: 320 }} align='left'>
      <img src={data.src} alt='crema-logo' />
      <StyledHeading>{data.heading}</StyledHeading>
      <StyledText>{data.text}</StyledText>
      <Button type='link' style={{ paddingLeft: 0, fontWeight: 'bolder' }}>
        Learn More &#8614;
      </Button>
    </Card>
  );
};

export default PeopleCard;

PeopleCard.propTypes = {
  data: PropTypes.object,
};
