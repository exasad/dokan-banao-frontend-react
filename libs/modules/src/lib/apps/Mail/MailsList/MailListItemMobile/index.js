import React from 'react';

import moment from 'moment';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import AppsStarredIcon from '@crema/components/AppsStarredIcon';
import { CheckOutlined } from '@ant-design/icons';
import { getStringFromHtml } from '@crema/helpers';
import {
  StyledMailListActionMobile,
  StyledMailListAvatarMobile,
  StyledMailListAvatarMobileView,
  StyledMailListContentMobile,
  StyledMailListDescMobile,
  StyledMailListItemMobile,
  StyledMailListMainContent,
  StyledMailListStarredMobile,
  StyledMailListSubTitleMobile,
  StyledMailListTimeMobile,
  StyleMailListTitleMobile,
} from './index.styled';
import { StyledMailListDate } from '../index.styled';

const MailListItemMobile = (props) => {
  const {
    mail,
    checkedMails,
    onChangeCheckedMails,
    onChangeStarred,
    onViewMailDetail,
  } = props;

  const messages = mail.messages.length;

  const onGetMailDate = () => {
    const date = mail.messages[messages - 1].sentOn;
    if (
      moment(date, 'ddd, MMM DD, YYYY').format() ===
      moment('ddd, MMM DD, YYYY').format()
    ) {
      return moment(date).format('LT');
    } else {
      return date.split(',')[1];
    }
  };

  const getSenderName = () => {
    if (messages === 1) {
      return mail.messages[0].sender.name;
    } else if (messages === 2) {
      return `${mail.messages[0].sender.name}, ${mail.messages[1].sender.name}(2)`;
    } else {
      return `${mail.messages[0].sender.name}, ${
        mail.messages[messages - 2].sender.name
      }, ${mail.messages[messages - 1].sender.name}(${messages})`;
    }
  };

  const getDescription = () => {
    return mail.messages[messages - 1].description;
  };

  return (
    <StyledMailListItemMobile
      key={mail.id}
      className={clsx('item-hover', {
        mailRead: mail.isRead,
      })}
      onClick={() => onViewMailDetail(mail)}
    >
      <StyledMailListAvatarMobileView
        className={clsx({
          checked: checkedMails.includes(mail.id),
        })}
        onClick={(event) => {
          event.stopPropagation();
          onChangeCheckedMails(!checkedMails.includes(mail.id), mail.id);
        }}
      >
        {checkedMails.includes(mail.id) ? (
          <CheckOutlined />
        ) : (
          <StyledMailListAvatarMobile>
            {getSenderName().charAt(0).toUpperCase()}
          </StyledMailListAvatarMobile>
        )}
      </StyledMailListAvatarMobileView>

      <StyledMailListContentMobile>
        <StyledMailListMainContent>
          <StyleMailListTitleMobile className='text-truncate'>
            {getSenderName()}
          </StyleMailListTitleMobile>
          <StyledMailListSubTitleMobile className='text-truncate'>
            {mail.subject}
          </StyledMailListSubTitleMobile>
          <StyledMailListDescMobile className='text-truncate'>
            {getStringFromHtml(getDescription())}
          </StyledMailListDescMobile>
        </StyledMailListMainContent>

        <StyledMailListActionMobile>
          <StyledMailListTimeMobile>
            <StyledMailListDate className='text-truncate'>
              {onGetMailDate(mail.sentOn)}
            </StyledMailListDate>
          </StyledMailListTimeMobile>

          <StyledMailListStarredMobile
            onClick={(event) => event.stopPropagation()}
          >
            <AppsStarredIcon
              item={mail}
              onChange={() => onChangeStarred(!mail.isStarred, mail)}
            />
          </StyledMailListStarredMobile>
        </StyledMailListActionMobile>
      </StyledMailListContentMobile>
    </StyledMailListItemMobile>
  );
};

export default MailListItemMobile;

MailListItemMobile.defaultProps = {
  labelList: [],
  checkedMails: [],
};

MailListItemMobile.propTypes = {
  mail: PropTypes.object.isRequired,
  labelList: PropTypes.array,
  onChangeStarred: PropTypes.func,
  onViewMailDetail: PropTypes.func,
  checkedMails: PropTypes.array,
  onChangeCheckedMails: PropTypes.func,
};
