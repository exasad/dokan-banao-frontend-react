import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MailContentHeader from './MailContentHeader';
import MailListItem from './MailListItem';
import AppsPagination from '@crema/components/AppsPagination';
import AppsContent from '@crema/components/AppsContent';
import AppsHeader from '@crema/components/AppsHeader';
import AppsFooter from '@crema/components/AppsFooter';
import AppList from '@crema/components/AppList';
import ListEmptyResult from '@crema/components/AppList/ListEmptyResult';
import EmailListSkeleton from '@crema/components/EmailListSkeleton';
import {
  StyledAppsMailFooter,
  StyledMailListDesktop,
  StyledMailListMobile,
} from './index.styled';
import { MailListItemMobile } from '@crema/modules/apps/Mail';
import { useDispatch, useSelector } from 'react-redux';
import {
  onGetMailList,
  onUpdateMailReadStatus,
  onUpdateMailStarredStatus,
} from '../../../../toolkit/actions';

const MailsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [page, setPage] = useState(0);
  const [filterText, onSetFilterText] = useState('');
  const { pathname } = useLocation();
  const path = pathname.split('/');
  const mailList = useSelector(({ mailApp }) => mailApp.mailList);
  const totalMails = useSelector(({ mailApp }) => mailApp.totalMails);
  const loading = useSelector(({ common }) => common.loading);

  const labelList = useSelector(({ mailApp }) => mailApp.labelList);

  const [checkedMails, setCheckedMails] = useState([]);

  useEffect(() => {
    setPage(0);
  }, [pathname]);

  useEffect(() => {
    const path = pathname.split('/');
    dispatch(onGetMailList(path[path.length - 2], path[path.length - 1], page));
  }, [page, pathname, checkedMails, dispatch]);

  useEffect(() => {
    setPage(0);
  }, [pathname]);

  const onChange = (page) => {
    setPage(page - 1);
  };

  const onChangeCheckedMails = (checked, id) => {
    if (checked) {
      setCheckedMails(checkedMails.concat(id));
    } else {
      setCheckedMails(checkedMails.filter((mailId) => mailId !== id));
    }
  };

  const onViewMailDetail = (mail) => {
    if (!mail.isRead) dispatch(onUpdateMailReadStatus([mail.id], true, false));
    navigate(`/apps/mail/${params.name}/${mail.id}`);
  };

  const onChangeStarred = (checked, mail) => {
    dispatch(
      onUpdateMailStarredStatus([mail.id], checked, path[path.length - 1]),
    );
  };

  return (
    <>
      <AppsHeader>
        <MailContentHeader
          checkedMails={checkedMails}
          setCheckedMails={setCheckedMails}
          onChange={onChange}
          mailList={mailList}
          totalMails={totalMails}
          page={page}
          path={path}
          filterText={filterText}
          onSetFilterText={onSetFilterText}
        />
      </AppsHeader>
      <AppsContent>
        <StyledMailListDesktop>
          <AppList
            data={mailList?.filter((item) =>
              item.subject.toLowerCase().includes(filterText.toLowerCase()),
            )}
            ListEmptyComponent={
              <ListEmptyResult
                loading={loading}
                placeholder={<EmailListSkeleton />}
              />
            }
            renderItem={(mail) => (
              <MailListItem
                mail={mail}
                key={mail.id}
                labelList={labelList}
                onChangeCheckedMails={onChangeCheckedMails}
                checkedMails={checkedMails}
                onViewMailDetail={onViewMailDetail}
                onChangeStarred={onChangeStarred}
              />
            )}
          />
        </StyledMailListDesktop>
        <StyledMailListMobile>
          <AppList
            data={mailList?.filter((item) =>
              item.subject.toLowerCase().includes(filterText.toLowerCase()),
            )}
            ListEmptyComponent={
              <ListEmptyResult
                loading={loading}
                placeholder={<EmailListSkeleton />}
              />
            }
            renderItem={(mail) => (
              <MailListItemMobile
                mail={mail}
                key={mail.id}
                labelList={labelList}
                onViewMailDetail={onViewMailDetail}
                onChangeStarred={onChangeStarred}
                checkedMails={checkedMails}
                onChangeCheckedMails={onChangeCheckedMails}
              />
            )}
          />
        </StyledMailListMobile>
      </AppsContent>
      {mailList.length > 0 ? (
        <StyledAppsMailFooter>
          <AppsFooter>
            <AppsPagination
              count={totalMails}
              page={page}
              onChange={onChange}
            />
          </AppsFooter>
        </StyledAppsMailFooter>
      ) : null}
    </>
  );
};

export default MailsList;
