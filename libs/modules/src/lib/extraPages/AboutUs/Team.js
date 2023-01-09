import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import IntlMessages from '@crema/helpers/IntlMessages';
import { teamData } from '@crema/fakedb/extraPages';
import {
  StyledTeamCard,
  StyledTeamSliderInfo,
  StyledTeamSliderThumb,
  StyledTeamSliderView,
} from './index.styled';

const settings = {
  dots: true,
  infinite: true,
  arrows: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,

  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 400,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Team = () => {
  return (
    <StyledTeamCard>
      <h2>
        <IntlMessages id='extra.team' />
      </h2>

      <StyledTeamSliderView>
        <Slider {...settings}>
          {teamData.map((member) => {
            return (
              <StyledTeamSliderInfo key={member.id}>
                <StyledTeamSliderThumb>
                  <img src={member.image} alt='about us' title='aboutUs' />
                </StyledTeamSliderThumb>
                <h5>{member.name}</h5>
                <p className='mb-0'>{member.position}</p>
              </StyledTeamSliderInfo>
            );
          })}
        </Slider>
      </StyledTeamSliderView>
    </StyledTeamCard>
  );
};

export default Team;
