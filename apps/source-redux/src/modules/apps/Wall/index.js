import React, { useEffect } from 'react';
import AppsContainer from '@crema/components/AppsContainer';
import { useIntl } from 'react-intl';
import AppPageMeta from '@crema/components/AppPageMeta';
import {
  StyledAppRowContainer,
  StyledWallLeftSidebar,
  StyledWallMainContent,
  StyledWallRightSidebar,
  StyledWallScrollBar,
} from './index.styled';
import {
  About,
  FriendRequests,
  Photos,
  RecentNews,
  Suggestions,
  SuggestTeam,
  VideoCall,
  Stories,
  WhatsHappen,
  WhoToFollow,
} from '@crema/modules/apps/Wall';
import { useDispatch, useSelector } from 'react-redux';
import { onGetWallData } from '../../../redux/actions';
import CreatePost from './CreatePost';
import PostsList from './PostsList';

const Wall = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetWallData());
  }, [dispatch]);

  const wallData = useSelector(({ wall }) => wall.wallData);
  const { messages } = useIntl();

  return (
    <AppsContainer
      title={messages['sidebar.apps.wall']}
      cardStyle={{ backgroundColor: 'transparent', boxShadow: 'none' }}
      fullView
    >
      <AppPageMeta title='Wall App' />
      {wallData && (
        <StyledAppRowContainer
          style={{
            height: 'calc(100% - 32px)',
            padding: 8,
          }}
        >
          <StyledWallLeftSidebar xs={24} md={6} xl={6} xxl={6}>
            <StyledWallScrollBar>
              <div>
                <VideoCall data={wallData?.videoCall} />
                <About about={wallData?.about} />
                <SuggestTeam data={wallData?.suggestTeam} />
                <Photos photos={wallData?.photos} />
                <Suggestions suggestions={wallData?.suggestions} />
              </div>
            </StyledWallScrollBar>
          </StyledWallLeftSidebar>
          <StyledWallMainContent xs={24} md={12} xl={12} xxl={12}>
            <StyledWallScrollBar style={{ height: '100%' }}>
              <div>
                <CreatePost wallData={wallData} />
                <PostsList wallData={wallData} />
              </div>
            </StyledWallScrollBar>
          </StyledWallMainContent>
          <StyledWallRightSidebar xs={24} md={6} xl={6} xxl={6}>
            <StyledWallScrollBar style={{ height: '100%' }}>
              <div>
                <Stories stories={wallData?.stories} />
                <WhatsHappen whatsHappen={wallData?.whatsHappen} />
                <WhoToFollow whoToFollow={wallData?.whoToFollow} />
                <FriendRequests friendRequests={wallData?.friendRequests} />
                <RecentNews recentNews={wallData?.recentNews} />
              </div>
            </StyledWallScrollBar>
          </StyledWallRightSidebar>
        </StyledAppRowContainer>
      )}
    </AppsContainer>
  );
};

export default Wall;
