import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  StyledCommentOutlined,
  StyledLikeOutlined,
  StyledPostStats,
  StyledPostStatsItem,
  StyledPostStatsItemInfo,
  StyledShareAltOutlined,
} from '../index.styled';
import { useDispatch } from 'react-redux';
import { onUpdatePostStatus } from '../../../../../redux/actions';

const PostStats = ({ post }) => {
  const dispatch = useDispatch();

  const toggleLikeStatus = () => {
    dispatch(onUpdatePostStatus(post.id, !post.liked));
  };

  return (
    <StyledPostStats>
      <StyledPostStatsItem
        className={clsx({ active: post.liked })}
        onClick={toggleLikeStatus}
      >
        <StyledLikeOutlined />
        <StyledPostStatsItemInfo>{post.likes} likes</StyledPostStatsItemInfo>
      </StyledPostStatsItem>
      {post.comments.length > 0 && (
        <StyledPostStatsItem>
          <StyledCommentOutlined />
          <StyledPostStatsItemInfo>
            {post.comments.length} Comments
          </StyledPostStatsItemInfo>
        </StyledPostStatsItem>
      )}
      <StyledPostStatsItem>
        <StyledShareAltOutlined />
        <StyledPostStatsItemInfo>{post.shares} Shares</StyledPostStatsItemInfo>
      </StyledPostStatsItem>
    </StyledPostStats>
  );
};

export default PostStats;

PostStats.propTypes = {
  post: PropTypes.object.isRequired,
  setPostList: PropTypes.func,
};
