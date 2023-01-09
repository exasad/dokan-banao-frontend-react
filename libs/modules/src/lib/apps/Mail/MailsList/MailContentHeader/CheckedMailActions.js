import React from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';
import { BiArchiveIn } from 'react-icons/bi';
import { HiOutlineFolderRemove } from 'react-icons/hi';
import { MdLabelOutline } from 'react-icons/md';
import { AiOutlineDelete, AiOutlineInfoCircle } from 'react-icons/ai';
import AppIconButton from '@crema/components/AppIconButton';
import { StyledMailCheckedAction } from '../index.styled';
import { putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/InfoViewContextProvider';

const CheckedMailActions = (props) => {
  const { checkedMails, setCheckedMails, setData } = props;
  const infoViewActionsContext = useInfoViewActionsContext();

  const [{ apiData: labelList }] = useGetDataApi(
    '/api/mailApp/labels/list',
    [],
  );

  const [{ apiData: folderList }] = useGetDataApi(
    '/api/mailApp/folders/list',
    [],
  );

  const onChangeMailFolder = (key) => {
    putDataApi('/api/mailApp/update/folder', infoViewActionsContext, {
      mailIds: checkedMails,
      folderId: key,
    })
      .then((data) => {
        setData(data);
        infoViewActionsContext.showMessage('Mail moved to folder successfully');
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
    setCheckedMails([]);
  };

  const onSelectLabel = (key) => {
    const labelType = labelList.find(
      (label) => label.id.toString() === key.toString(),
    );
    putDataApi('/api/mailApp/update/label', infoViewActionsContext, {
      mailIds: checkedMails,
      type: labelType,
    })
      .then((data) => {
        setData(data);
        infoViewActionsContext.showMessage('Mail moved to folder successfully');
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
    setCheckedMails([]);
  };

  const menuLabel = labelList?.map((label, index) => {
    return {
      key: index,
      label: <span onClick={() => onSelectLabel(label.id)}>{label.name}</span>,
    };
  });

  const menuMoveTo = folderList?.map((folder, index) => {
    return {
      key: index,
      label: (
        <span onClick={() => onChangeMailFolder(folder.id)}>{folder.name}</span>
      ),
    };
  });

  return (
    <StyledMailCheckedAction>
      <AppIconButton
        title={<IntlMessages id='common.archive' />}
        onClick={() => onChangeMailFolder(127)}
        icon={<BiArchiveIn />}
      />

      <AppIconButton
        title={<IntlMessages id='common.reportSpam' />}
        onClick={() => onChangeMailFolder(125)}
        icon={<AiOutlineInfoCircle />}
      />

      <AppIconButton
        title={<IntlMessages id='common.trash' />}
        onClick={() => onChangeMailFolder(126)}
        icon={<AiOutlineDelete />}
      />

      <Dropdown menu={{ items: menuLabel }} trigger={['click']}>
        <AppIconButton
          title={<IntlMessages id='common.label' />}
          icon={<MdLabelOutline />}
        />
      </Dropdown>

      <Dropdown menu={{ items: menuMoveTo }} trigger={['click']}>
        <AppIconButton
          title={<IntlMessages id='common.moveTo' />}
          icon={<HiOutlineFolderRemove />}
        />
      </Dropdown>
    </StyledMailCheckedAction>
  );
};

export default CheckedMailActions;

CheckedMailActions.defaultProps = {
  checkedMails: [],
};

CheckedMailActions.propTypes = {
  checkedMails: PropTypes.array.isRequired,
  setCheckedMails: PropTypes.func,
  setData: PropTypes.func,
};
