import AppCard from '@crema/components/AppCard';
import styled from 'styled-components';

export const StyledBuyCellCard = styled(AppCard)`
  position: relative;

  & .ant-tabs-nav:before {
    display: none;
  }

  & .ant-tabs-tab {
    font-size: ${({ theme }) => theme.font.size.lg};
    text-transform: capitalize;
    padding-top: 4px;
    padding-bottom: 12px;
    margin-left: 8px;
    margin-right: 8px;
    font-weight: ${({ theme }) => theme.font.weight.bold};

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.xxl}px) {
      margin-left: 20px;
      margin-right: 20px;
    }
  }

  & .ant-card-actions {
    border-top: 0 none;
    background-color: transparent;

    & li {
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 16px;
      text-align: left;
      margin: 0;

      [dir='rtl'] & {
        text-align: right;
      }

      & a {
        color: ${({ theme }) => theme.palette.secondary.main} !important;
      }
    }
  }
`;

export const StyledTabForm = styled.form`
  position: relative;

  & .form-field {
    margin-bottom: 12px;

    @media screen and (min-width: ${({ theme }) => theme.breakpoints.md}px) {
      margin-bottom: 20px;
    }
  }
`;

export const StyledTabFormRightText = styled.div`
  margin: 8px;
  text-align: right;
  color: ${({ theme }) => theme.palette.gray[400]};
  text-transform: uppercase;

  [dir='rtl'] & {
    text-align: left;
  }
`;
