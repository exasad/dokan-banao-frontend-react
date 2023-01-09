import React from 'react';
import AppCard from '@crema/components/AppCard';
import MapChart from '../../Widgets/CountryMap/MapChart';
import AppSelect from '@crema/components/AppSelect';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  StyledCountryMapChart,
  StyledEarningCountryFooter,
  StyledEarningCountryFooterItem,
} from './index.styled';

const EarningByCountry = ({ earningData }) => {
  const handleSelectionType = (data) => {
    console.log('data: ', data);
  };

  const { messages } = useIntl();
  return (
    <AppCard
      heightFull
      title={messages['dashboard.analytics.earningByCountries']}
      extra={
        <AppSelect
          menus={[
            messages['dashboard.thisWeek'],
            messages['dashboard.lastWeeks'],
            messages['dashboard.lastMonth'],
          ]}
          defaultValue={messages['dashboard.thisWeek']}
          onChange={handleSelectionType}
        />
      }
    >
      <StyledCountryMapChart>
        <MapChart />
      </StyledCountryMapChart>

      <StyledEarningCountryFooter>
        {earningData.map((data) => (
          <StyledEarningCountryFooterItem key={data.id}>
            <h3>${data.amount}</h3>
            <div className='ant-row ant-row-middle'>
              <span className='dot' style={{ backgroundColor: data.color }} />
              <p>{data.country}</p>
            </div>
          </StyledEarningCountryFooterItem>
        ))}
      </StyledEarningCountryFooter>
    </AppCard>
  );
};

export default EarningByCountry;

EarningByCountry.propTypes = {
  earningData: PropTypes.array,
};
