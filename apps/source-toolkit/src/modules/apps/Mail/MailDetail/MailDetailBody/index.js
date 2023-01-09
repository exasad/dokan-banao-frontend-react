import React from 'react';
import PropTypes from 'prop-types';
import {
  StyledMailDetailBody,
  StyledMailDetailBodyContent,
} from '../index.styled';
import { MessageItem } from '@crema/modules/apps/Mail';
import { useDispatch } from 'react-redux';
import { onUpdateSelectedMail } from '../../../../../toolkit/actions';

const MailDetailBody = ({ selectedMail }) => {
  const dispatch = useDispatch();
  const onSubmitMail = (message, index) => {
    let messages = selectedMail.messages;
    messages.splice(index + 1, 0, message);
    dispatch(onUpdateSelectedMail({ ...selectedMail, messages }));
  };

  const onChangeStarred = (message, isStarred) => {
    const messages = selectedMail.messages.map((data) =>
      data.messageId === message.messageId ? { ...message, isStarred } : data,
    );
    dispatch(onUpdateSelectedMail({ ...selectedMail, messages }));
  };

  return (
    <StyledMailDetailBody>
      {selectedMail ? (
        <StyledMailDetailBodyContent>
          {selectedMail.messages.map((message, index) => (
            <MessageItem
              key={index}
              index={index}
              mailLength={selectedMail.messages.length}
              message={message}
              onSubmitMail={onSubmitMail}
              onChangeStarred={onChangeStarred}
            />
          ))}
        </StyledMailDetailBodyContent>
      ) : null}
    </StyledMailDetailBody>
  );
};

export default MailDetailBody;

MailDetailBody.propTypes = {
  selectedMail: PropTypes.object.isRequired,
  onUpdateSelectedMail: PropTypes.func,
};
