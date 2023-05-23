import AppLoader from '@crema/components/AppLoader';
import { BlogDetail } from '@crema/modules/extraPages/Blog';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { isEmptyObject } from '@crema/helpers';
import { getBlogDetail } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

const BlogDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedBlog = useSelector(({ blogs }) => blogs.selectedBlog);
  const { loading } = useSelector(({ common }) => common);

  useEffect(() => {
    dispatch(getBlogDetail(id));
  }, [dispatch, id]);

  return loading ? (
    <AppLoader />
  ) : (
    !isEmptyObject(selectedBlog?.blogDetail) && (
      <BlogDetail
        blogSidebar={selectedBlog.blogSidebar}
        blogDetail={selectedBlog.blogDetail}
      />
    )
  );
};
export default BlogDetailPage;
