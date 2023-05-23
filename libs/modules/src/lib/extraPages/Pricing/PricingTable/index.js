import React from 'react';
import { StyledTable } from './index.styled.js';
import { getColumns } from './columns';

const PricingTable = ({ billingFormat, tableData }) => {
  return (
    <StyledTable
      columns={getColumns(billingFormat)}
      dataSource={tableData}
      pagination={false}
      ellipsis={true}
    />
  );
};

export default PricingTable;
