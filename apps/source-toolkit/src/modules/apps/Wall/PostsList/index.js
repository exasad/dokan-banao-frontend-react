import React, { useEffect } from 'react';
import PostItem from './PostItem';
import { StyledPostList } from './index.styled';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { onGetPostsList } from '../../../../toolkit/actions';

const PostsList = ({ wallData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetPostsList());
  }, [dispatch]);

  const { postList } = useSelector(({ wall }) => wall);
  return (
    <StyledPostList
      data={postList}
      renderItem={(post, index) => (
        <PostItem
          key={index}
          post={post}
          wallData={wallData}
          isLast={postList.length - 1 === index}
        />
      )}
    />
  );
};

export default PostsList;

PostsList.propTypes = {
  wallData: PropTypes.object,
  postList: PropTypes.array,
  setPostList: PropTypes.func,
};
