import AppCard from '@crema/components/AppCard';
import styled from 'styled-components';

export const StyledReportCard = styled(AppCard)`
  overflow: hidden;
`;

export const StyledReportFlex = styled.div`
  display: flex;
`;

export const StyledReportContent = styled.div`
  flex: 1;
  padding-right: 12px;
  color: ${({ theme }) => theme.palette.text.secondary};

  [dir='rtl'] & {
    padding-right: 0;
    padding-left: 12px;
  }

  & h3 {
    font-size: 20px;
    margin-bottom: 2px;
  }
`;

export const StyledRechartContainer = styled.div`
  min-width: 150px;
  max-width: 160px;
`;

export const StyledRechartAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;
