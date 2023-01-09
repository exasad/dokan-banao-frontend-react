import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import {
  StyledTicketSupportTable,
  StyledTicketSupportUserInfo,
  StyledTicketSupportUserInfoContent,
} from '../index.styled';

const columns = [
  {
    title: 'No.',
    dataIndex: `id`,
    key: 'id',
    render: (id) => <span>{id}.</span>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name) => (
      <StyledTicketSupportUserInfo>
        <Avatar src={name.image} />
        <StyledTicketSupportUserInfoContent>
          <h3>{name.name}</h3>
        </StyledTicketSupportUserInfoContent>
      </StyledTicketSupportUserInfo>
    ),
  },
  {
    title: 'Ticket ID',
    dataIndex: 'ticketId',
    key: 'ticketId',
  },
  {
    title: 'Create Date',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: 'Contact',
    dataIndex: 'contact',
    key: 'contact',
  },
];

// const getData = (data) => {
//   if (isBreakPointDown('xl')) {
//     return data.slice(0, 9);
//   } else {
//     return data.slice(0, 7);
//   }
// };

const TicketSupportTable = (props) => {
  const ticketSupportData = props.ticketSupportData;

  return (
    <StyledTicketSupportTable
      hoverColor
      data={ticketSupportData}
      columns={columns}
    />
  );
};

export default TicketSupportTable;

TicketSupportTable.defaultProps = {
  ticketSupportData: [],
};

TicketSupportTable.propTypes = {
  ticketSupportData: PropTypes.array,
};
