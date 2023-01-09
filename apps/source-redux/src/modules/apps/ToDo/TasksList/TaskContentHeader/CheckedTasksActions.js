import React from 'react';
import IntlMessages from '@crema/helpers/IntlMessages';
import AppsDeleteIcon from '@crema/components/AppsDeleteIcon';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Dropdown } from 'antd';
import { MdLabelOutline } from 'react-icons/md';
import AppIconButton from '@crema/components/AppIconButton';
import { StyledTodoHeaderCheckedAction } from '../index.styled';
import { useDispatch, useSelector } from 'react-redux';
import {
  onDeleteSelectedTasks,
  onUpdateTaskLabels,
} from '../../../../../redux/actions';

const CheckedTasksActions = ({ checkedTasks, setCheckedTasks, page }) => {
  const { pathname } = useLocation();
  const path = pathname.split('/');
  const dispatch = useDispatch();

  const labelList = useSelector(({ todoApp }) => todoApp.labelList);

  const onDeleteTasks = () => {
    dispatch(
      onDeleteSelectedTasks(
        checkedTasks,
        path[path.length - 2],
        path[path.length - 1],
        page,
      ),
    );
    setCheckedTasks([]);
  };

  const onSelectLabel = (key) => {
    dispatch(onUpdateTaskLabels(checkedTasks, key));
    setCheckedTasks([]);
  };

  const menuLabel = labelList.map((label, index) => {
    return {
      key: index,
      label: <span onClick={() => onSelectLabel(label.id)}> {label.name}</span>,
    };
  });

  return (
    <StyledTodoHeaderCheckedAction>
      <AppsDeleteIcon
        deleteAction={onDeleteTasks}
        deleteTitle={<IntlMessages id='todo.deleteMessage' />}
      />

      <Dropdown menu={{ items: menuLabel }} trigger={['click']}>
        <AppIconButton
          title={<IntlMessages id='common.label' />}
          icon={<MdLabelOutline />}
        />
      </Dropdown>
    </StyledTodoHeaderCheckedAction>
  );
};

export default CheckedTasksActions;

CheckedTasksActions.propTypes = {
  checkedTasks: PropTypes.array.isRequired,
  setCheckedTasks: PropTypes.func,
  onUpdateTasks: PropTypes.func,
  setData: PropTypes.func,
  page: PropTypes.number.isRequired,
};
