import React, { useEffect } from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import AppsSideBarFolderItem from '@crema/components/AppsSideBarFolderItem';
import AppList from '@crema/components/AppList';
import ListEmptyResult from '@crema/components/AppList/ListEmptyResult';
import SidebarPlaceholder from '@crema/components/SidebarListSkeleton';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import {
  StyledSidebarHeader,
  StyledPlusOutlined,
  StyledSidebarScrollbar,
  StyledSidebarList,
} from './index.styled';
import { useDispatch, useSelector } from 'react-redux';
import { onGetInvoiceFolderList } from '../../../../toolkit/actions';

const TaskSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const folderList = useSelector(({ invoiceApp }) => invoiceApp.folderList);

  useEffect(() => {
    dispatch(onGetInvoiceFolderList());
  }, [dispatch]);

  return (
    <>
      <StyledSidebarHeader>
        <Button
          ghost
          type='primary'
          icon={<StyledPlusOutlined style={{ marginRight: 8 }} />}
          onClick={() => navigate('/invoice/list/add')}
        >
          <IntlMessages id='invoice.addNewInvoice' />
        </Button>
      </StyledSidebarHeader>

      <StyledSidebarScrollbar>
        <StyledSidebarList>
          <AppList
            data={folderList}
            ListEmptyComponent={
              <ListEmptyResult
                loading={true}
                placeholder={<SidebarPlaceholder />}
              />
            }
            renderItem={(item) => (
              <AppsSideBarFolderItem
                key={item.id}
                item={item}
                path={`/invoice/home/${item.alias}`}
              />
            )}
          />
        </StyledSidebarList>
      </StyledSidebarScrollbar>
    </>
  );
};

export default TaskSideBar;
