import AppLoader from '@crema/components/AppLoader';
import { BlogContent } from '@crema/modules/extraPages/Blog';
import { isEmptyObject } from '@crema/helpers';
import AppAnimate from '@crema/components/AppAnimate';
import { useEffect } from 'react';
import { getBlogList } from '../../../toolkit/actions';
import { useDispatch, useSelector } from 'react-redux';

const Blogs = () => {
  const blogLists = useSelector(({ blogs }) => blogs.blogLists);
  const { loading } = useSelector(({ common }) => common);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBlogList());
  }, [dispatch]);

  return loading ? (
    <AppLoader />
  ) : (
    !isEmptyObject(blogLists.blogSidebar) && (
      <AppAnimate animation='transition.slideUpIn' delay={200}>
        <BlogContent
          blogSidebar={blogLists.blogSidebar}
          blogContent={blogLists.blogContent}
        />
      </AppAnimate>
    )
  );
};
export default Blogs;
