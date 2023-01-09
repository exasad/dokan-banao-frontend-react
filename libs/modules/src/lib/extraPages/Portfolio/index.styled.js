import { Tabs } from 'antd';
import styled from 'styled-components';

export const StyledPortfolio = styled.div`
  width: 100%;
`;

export const StyledPortfolioHeader = styled.div`
  max-width: 672px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  margin-bottom: 24px;

  & h2 {
    color: ${({ theme }) => theme.palette.text.primary};
    margin-bottom: 16px;
    font-weight: ${({ theme }) => theme.font.weight.medium};
    font-size: 20px;
  }

  & p {
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-bottom: 12px;
    font-size: 14px;
  }
`;

export const StyledPortfolioTabs = styled(Tabs)`
  & .ant-tabs-nav {
    margin-bottom: 20px;
  }

  & .ant-tabs-nav-wrap .ant-tabs-nav-list,
  & .ant-tabs-nav-wrap {
    justify-content: center;
  }

  & .ant-tabs-tab {
    font-size: ${({ theme }) => theme.font.size.lg};
    min-width: 10px;
    text-transform: capitalize;
    color: ${({ theme }) => theme.palette.text.primary};
    padding: 6px 12px;
    margin: 0;
    min-height: 48px;
  }

  & .ant-tabs-content-holder {
    margin-bottom: 30px;
  }

  & .react-photo-gallery--gallery img {
    border-radius: ${({ theme }) => theme.cardRadius};
  }
`;
