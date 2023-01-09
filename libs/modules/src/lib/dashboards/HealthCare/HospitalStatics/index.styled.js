import styled from 'styled-components';

export const StyledHospitalStatistics = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  @media screen and (min-width: ${({ theme }) => theme.breakpoints.xxl}px) {
    margin-top: 8px;
    margin-bottom: 8px;
  }
`;

export const StyledHospitalStaticsThumb = styled.div`
  margin-right: 16px;

  [dir='rtl'] & {
    margin-right: 0;
    margin-left: 16px;
  }
`;

export const StyledHospitalStaticsContent = styled.div`
  width: calc(100% - 70px);

  & .title {
    font-size: ${({ theme }) => theme.font.size.lg};
    margin-bottom: 2px;
  }

  & p {
    margin-bottom: 0;
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;
