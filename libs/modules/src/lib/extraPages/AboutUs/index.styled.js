import { Avatar, Button, Card } from 'antd';
import styled from 'styled-components';

export const StyledAboutIntroCard = styled(Card)`
  overflow: hidden;
  & .ant-card-body {
    padding: 0;
  }
`;

export const StyledImageAboutView = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    flex-direction: row;
  }
`;

export const StyledAboutImage = styled.div`
  width: 100%;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    width: 40%;
    order: 2;
  }

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.xxl}px) {
    max-height: 300px;
  }

  & > img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

export const StyledAboutImgContent = styled.div`
  width: 100%;
  padding: 20px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}px) {
    width: 60%;
    order: 1;
  }

  & h2 {
    margin-bottom: 16px;
    font-weight: ${({ theme }) => theme.font.weight.bold};
    font-size: ${({ theme }) => theme.font.size.lg};
  }

  & p {
    margin-bottom: 20px;
  }
`;

export const StyledAboutBtnView = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.xxl}px) {
    margin-left: -12px;
    margin-right: -12px;
  }

  & .btn {
    font-size: ${({ theme }) => theme.font.size.base};
    margin-bottom: 8px;
    font-weight: ${({ theme }) => theme.font.weight.light};
    margin-left: 8px;
    margin-right: 8px;
    text-transform: uppercase;

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.xxl}px) {
      margin-right: 12px;
      margin-left: 12px;
    }
  }
`;

export const StyledAboutReadButton = styled(Button)`
  font-weight: ${({ theme }) => theme.font.weight.medium};
  background-color: white;
  color: black;
`;

export const StyledAboutSectionCard = styled(Card)`
  & .ant-card-body {
    padding: 20px;
    text-align: center;
  }

  & h2 {
    margin-bottom: 16px;
    font-weight: ${({ theme }) => theme.font.weight.bold};
    font-size: ${({ theme }) => theme.font.size.lg};
  }

  & p {
    margin-bottom: 20px;
  }

  & .read-btn {
    font-size: ${({ theme }) => theme.font.size.base};
    font-weight: ${({ theme }) => theme.font.weight.medium};
    text-transform: uppercase;
  }
`;

export const StyledAboutSectionThumb = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledSectionAvatar = styled(Avatar)`
  width: 60px;
  height: 60px;
  display: flex;
  font-size: 24px;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: ${({ theme }) => theme.breakpoints.xxl}px) {
    width: 80px;
    height: 80px;
  }
`;

export const StyledTeamCard = styled(Card)`
  & .ant-card-body {
    padding: 20px;
  }

  & h2 {
    margin-bottom: 16px;
    font-weight: ${({ theme }) => theme.font.weight.bold};
    font-size: ${({ theme }) => theme.font.size.lg};
  }
`;

export const StyledTeamSliderView = styled.div`
  margin-left: -20px;
  margin-right: -20px;
  padding-bottom: 25px;

  & .slick-dots li {
    width: 12px;
    height: 12px;
    margin-right: 2px;
    margin-left: 2px;

    & button {
      width: 12px;
      height: 12px;

      &:before {
        width: 12px;
        height: 12px;
        font-size: 10px;
        color: #be8658;
      }
    }
  }

  & .slick-dots li.slick-active button:before {
    color: #825a44;
  }
`;

export const StyledTeamSliderInfo = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;

  & h5 {
    margin-bottom: 4px;
    font-weight: ${({ theme }) => theme.font.weight.medium};
    font-size: ${({ theme }) => theme.font.size.base};
  }
`;

export const StyledTeamSliderThumb = styled.div`
  width: 100%;
  margin-bottom: 12px;

  & img {
    border-radius: ${({ theme }) => theme.cardRadius};
    width: 100%;
  }
`;
