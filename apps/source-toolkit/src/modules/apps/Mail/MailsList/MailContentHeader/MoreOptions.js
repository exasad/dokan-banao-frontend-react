import React from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import PropTypes from 'prop-types';
import { FiMoreVertical } from 'react-icons/fi';
import { Dropdown } from 'antd';
import AppIconButton from '@crema/components/AppIconButton';
import { useDispatch } from 'react-redux';
import {
  onUpdateMailReadStatus,
  onUpdateMailStarredStatus,
} from '../../../../../toolkit/actions';

const MoreOptions = (props) => {
  const { checkedMails, setCheckedMails, mailList, path } = props;
  const dispatch = useDispatch();

  let unReadOption;
  let readOption;
  let starredOption;
  let unStarredOption;

  mailList.map((mail) => {
    if (checkedMails.includes(mail.id) && mail.isRead) {
      unReadOption = true;
    }
    if (checkedMails.includes(mail.id) && !mail.isRead) {
      readOption = true;
    }
    if (checkedMails.includes(mail.id) && mail.isStarred) {
      unStarredOption = true;
    }
    if (checkedMails.includes(mail.id) && !mail.isStarred) {
      starredOption = true;
    }
    return null;
  });

  const onChangeReadStatus = (statusValue) => {
    const status = !!statusValue;
    dispatch(onUpdateMailReadStatus(checkedMails, status));
    setCheckedMails([]);
  };

  const onChangeAllReadStatus = (statusValue) => {
    const status = !!statusValue;
    const allMails = mailList.map((mail) => mail.id);
    dispatch(onUpdateMailReadStatus(allMails, status));
    setCheckedMails([]);
  };

  const onChangeAllStarred = (status) => {
    const allMails = mailList.map((mail) => mail.id);
    dispatch(
      onUpdateMailStarredStatus(allMails, status, path[path.length - 1]),
    );
    setCheckedMails([]);
  };

  const onChangeStarredStatus = (status) => {
    dispatch(
      onUpdateMailStarredStatus(checkedMails, status, path[path.length - 1]),
    );
    setCheckedMails([]);
  };

  const menuViewMore = [
    {
      key: 1,
      label: readOption ? (
        <span onClick={() => onChangeReadStatus(1)}>
          <IntlMessages id='mailApp.markAsRead' />
        </span>
      ) : null,
    },
    {
      key: 2,
      label: unReadOption ? (
        <span onClick={() => onChangeReadStatus(0)}>
          <IntlMessages id='mailApp.markAsUnread' />
        </span>
      ) : null,
    },
    {
      key: 3,
      label: starredOption ? (
        <span onClick={() => onChangeStarredStatus(1)}>
          <IntlMessages id='mailApp.markAsImportant' />
        </span>
      ) : null,
    },
    {
      key: 4,
      label: unStarredOption ? (
        <span onClick={() => onChangeStarredStatus(0)}>
          <IntlMessages id='mailApp.markAsNotImportant' />
        </span>
      ) : null,
    },
  ];

  const menuViewMoreTo = [
    {
      key: '01',
      label: (
        <span onClick={() => onChangeAllReadStatus(1)}>
          <IntlMessages id='mailApp.markAllAsRead' />
        </span>
      ),
    },
    {
      key: '02',
      label: (
        <span onClick={() => onChangeAllReadStatus(0)}>
          <IntlMessages id='mailApp.markAllAsUnread' />
        </span>
      ),
    },
    {
      key: '03',
      label: (
        <span onClick={() => onChangeAllStarred(1)}>
          <IntlMessages id='mailApp.markAllAsImportant' />
        </span>
      ),
    },
    {
      key: '04',
      label: (
        <span onClick={() => onChangeAllStarred(0)}>
          <IntlMessages id='mailApp.markAllAsNotImportant' />
        </span>
      ),
    },
  ];

  return checkedMails.length > 0 ? (
    <Dropdown menu={{ items: menuViewMore }} trigger={['click']}>
      <AppIconButton
        title={<IntlMessages id='common.more' />}
        icon={<FiMoreVertical />}
      />
    </Dropdown>
  ) : (
    <Dropdown menu={{ items: menuViewMoreTo }} trigger={['click']}>
      <AppIconButton
        title={<IntlMessages id='common.more' />}
        icon={<FiMoreVertical />}
      />
    </Dropdown>
  );
};

export default MoreOptions;

MoreOptions.defaultProps = {
  checkedMails: [],
};

MoreOptions.propTypes = {
  checkedMails: PropTypes.array.isRequired,
  setCheckedMails: PropTypes.func,
  setData: PropTypes.func,
  path: PropTypes.any.isRequired,
  mailList: PropTypes.array,
};
