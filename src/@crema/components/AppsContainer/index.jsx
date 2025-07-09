import { useState } from 'react';
import AppInfoView from '../AppInfoView';
import PropTypes from 'prop-types';
import AppSidebar from './AppSidebar';
import clsx from 'clsx';
import { MenuOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutContext } from '@crema/context/AppContextProvider/LayoutContextProvider';
import {
  StyledAppContainer,
  StyledAppWrap,
  StyledAppWrapHeader,
  StyledMainContent,
  StyledMainContentCard,
  StyledMenuBtn,
} from './index.styled';

const AppsContainer = (props) => {
  const [isAppDrawerOpen, setAppDrawerOpen] = useState(false);
  const { footer, navStyle } = useLayoutContext();
  const { title, noContentAnimation, sidebarContent, fullView, children } =
    props;
  return (
    <StyledAppWrap>
      <StyledAppWrapHeader
        className={clsx({
          appsWrapHeaderFull: fullView,
        })}
      >
        {fullView ? null : (
          <StyledMenuBtn onClick={() => setAppDrawerOpen(!isAppDrawerOpen)}>
            <MenuOutlined className='menu-btn-icon' />
          </StyledMenuBtn>
        )}
        <AnimatePresence style={{ zIndex: 3, overflow: 'hidden' }} type='scale'>
          <motion.h2 className='text-truncate' key='title'>
            {title}
          </motion.h2>
        </AnimatePresence>
      </StyledAppWrapHeader>

      <StyledAppContainer>
        {sidebarContent ? (
          <AnimatePresence
            style={{ zIndex: 3 }}
            type={props.type ? props.type : 'left'}
          >
            <motion.div>
            <AppSidebar
              isAppDrawerOpen={isAppDrawerOpen}
              setAppDrawerOpen={setAppDrawerOpen}
              footer={footer}
              fullView={fullView}
              navStyle={navStyle}
              title={title}
              sidebarContent={sidebarContent}
              key='sidebar'
            />
            </motion.div>
          </AnimatePresence>
        ) : null}
        <StyledMainContent
          className={clsx({
            appsMainContentFull: fullView,
          })}
        >
          {noContentAnimation ? (
            <StyledMainContentCard
              bordered={false}
              key='content'
              style={{
                ...props.cardStyle,
                borderRadius: 16,
              }}
            >
              {children}
            </StyledMainContentCard>
          ) : (
            <AnimatePresence
              type={props.type ? props.type : 'right'}
              style={{ minHeight: '100%' }}
            >
              <motion.div>
              <StyledMainContentCard
                bordered={false}
                key='content'
                style={{
                  ...props.cardStyle,
                  borderRadius: 16,
                }}
              >
                {children}
              </StyledMainContentCard>
              </motion.div>
            </AnimatePresence>
          )}

          <AppInfoView />
        </StyledMainContent>
      </StyledAppContainer>
    </StyledAppWrap>
  );
};

export default AppsContainer;

AppsContainer.defaultProps = {
  title: '',
  noContentAnimation: false,
};

AppsContainer.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  cardStyle: PropTypes.object,
  noContentAnimation: PropTypes.bool,
  sidebarContent: PropTypes.node,
  fullView: PropTypes.bool,
  children: PropTypes.node,
  type: PropTypes.any,
};
