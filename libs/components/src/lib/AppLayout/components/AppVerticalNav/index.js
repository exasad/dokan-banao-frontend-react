import React, { useEffect, useState } from 'react';
import { getRouteMenus } from './VerticalMenuUtils';
import clsx from 'clsx';
import defaultConfig from '@crema/constants/defaultConfig';
import { useSidebarContext } from '@crema/context/SidebarContextProvider';
import { MenuStyle } from '@crema/constants/AppEnums';
import { StyledVerticalNav } from './index.styled';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const AppVerticalNav = ({ routesConfig }) => {
  const { menuStyle, sidebarColorSet } = useSidebarContext();
  const { pathname } = useLocation();
  const selectedKeys = pathname.substr(1).split('/');
  const [openKeys, setOpenKeys] = useState([selectedKeys[0]]);

  useEffect(() => {
    setOpenKeys([selectedKeys[selectedKeys.length - 2]]);
  }, []);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  return (
    <StyledVerticalNav
      theme={sidebarColorSet.mode}
      color={sidebarColorSet.sidebarMenuSelectedTextColor}
      bgcolor={sidebarColorSet.sidebarMenuSelectedBgColor}
      mode='inline'
      className={clsx({
        'menu-rounded': menuStyle === MenuStyle.ROUNDED,
        'menu-rounded rounded-menu-reverse':
          menuStyle === MenuStyle.ROUNDED_REVERSE,
        'menu-rounded standard-menu': menuStyle === MenuStyle.STANDARD,
        'menu-rounded curved-menu': menuStyle === MenuStyle.CURVED_MENU,
        'bg-color-menu':
          sidebarColorSet.sidebarBgColor !==
          defaultConfig.sidebar.colorSet.sidebarBgColor,
      })}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      defaultSelectedKeys={[selectedKeys[selectedKeys.length - 1]]}
      items={getRouteMenus(routesConfig)}
    />
  );
};

export default AppVerticalNav;
AppVerticalNav.propTypes = {
  routesConfig: PropTypes.array.isRequired,
};
