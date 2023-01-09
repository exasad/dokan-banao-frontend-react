import React from 'react';
import AppSelect from '@crema/components/AppSelect';
import GradeGraph from './GradeGraph';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  StyledAverageGradeCard,
  StyledAverageGradeGraphView,
} from './index.styled';

const AverageGrades = ({ grades }) => {
  const { messages } = useIntl();
  return (
    <StyledAverageGradeCard
      heightFull
      title={messages['academy.averageGrade']}
      extra={
        <div className='ant-row ant-row-middle'>
          <AppSelect
            menus={[2020, 2021, 2018]}
            defaultValue={2020}
            onChange={() => {}}
          />
          <AppSelect
            menus={['All Months', 'Jan', 'Feb']}
            defaultValue={'All Months'}
            onChange={() => {}}
          />
        </div>
      }
    >
      <StyledAverageGradeGraphView>
        <GradeGraph grades={grades} />
      </StyledAverageGradeGraphView>
    </StyledAverageGradeCard>
  );
};

export default AverageGrades;

AverageGrades.propTypes = {
  grades: PropTypes.array,
};
