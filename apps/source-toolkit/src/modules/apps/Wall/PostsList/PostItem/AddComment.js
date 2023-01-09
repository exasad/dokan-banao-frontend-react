import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SmileOutlined } from '@ant-design/icons';
import AppIconButton from '@crema/components/AppIconButton';
import { MdOutlineAttachFile } from 'react-icons/md';
import {
  StyledAddComment,
  StyledAddCommentInput,
  StyledAddCommentUser,
  StyledAddCommentUserInfo,
  StyledAddSuffixAction,
  StyledPostItemAvatar,
} from '../index.styled';
import { useDispatch } from 'react-redux';
import { onAddNewComment } from '../../../../../toolkit/actions';

const AddComment = ({ postId, wallData }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');

  const submitComment = (event) => {
    if (event.key === 'Enter') {
      const newComment = {
        author: {
          name: wallData.name,
          profilePic: wallData.profilePic,
          id: wallData.id,
        },
        comment,
      };
      dispatch(onAddNewComment(postId, newComment));
      setComment('');
    }
  };

  return (
    <StyledAddComment>
      <StyledPostItemAvatar src={wallData.profilePic} />
      <StyledAddCommentUser>
        <StyledAddCommentUserInfo>
          <StyledAddCommentInput
            placeholder='Write a comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={submitComment}
            suffix={
              <StyledAddSuffixAction>
                <AppIconButton icon={<SmileOutlined />} />
                <AppIconButton icon={<MdOutlineAttachFile />} />
              </StyledAddSuffixAction>
            }
          />
        </StyledAddCommentUserInfo>
      </StyledAddCommentUser>
    </StyledAddComment>
  );
};

export default AddComment;

AddComment.propTypes = {
  postId: PropTypes.number,
  wallData: PropTypes.object,
  setPostList: PropTypes.func,
};
