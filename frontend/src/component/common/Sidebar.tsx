'use client';

import React from 'react';
import type { MenuItemStyles } from 'react-pro-sidebar';
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  menuClasses,
} from 'react-pro-sidebar';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import EventIcon from '@/public/icons/event.svg';
import ProfileIcon from '@/public/icons/profile.svg';
import NotificationIcon from '@/public/icons/notification.svg';
import AccountSettingIcon from '@/public/icons/account-settings.svg';
import PaymentIcon from '@/public/icons/payment.svg';

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#101828',
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#101828',
      hover: {
        backgroundColor: '#e8f6ff',
        color: '#0056D2',
      },
      disabled: {
        color: '#9fb6cf',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#101828',
      color: '#8ba1b7',
    },
    menu: {
      menuContent: '#082440',
      icon: '#59d0ff',
      hover: {
        backgroundColor: '#0056D2',
        color: '#b6c8d9',
      },
      disabled: {
        color: '#3e5e7e',
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const sidebarMenu = [
  {
    title: 'Personal Info',
    icon: <ProfileIcon width={25} />,
    route: '/my-profile',
  },
  {
    title: 'Account Settings',
    icon: <AccountSettingIcon width={25} />,
    route: '/account-settings',
  },
  {
    title: 'My Events',
    icon: <EventIcon width={25} />,
    route: '/my-events',
  },
  {
    title: 'Ticket & payments',
    icon: <PaymentIcon width={25} />,
    route: '/payments',
  },
  {
    title: 'Notifications',
    icon: <NotificationIcon width={25} />,
    route: '/notifications',
  },
];

const theme = 'light';

export default function Sidebar() {
  const [toggled, setToggled] = React.useState(false);

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: '16px',
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9',
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes[theme].menu.menuContent, 1)
          : 'transparent',
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, 1),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  const pathname = usePathname();

  return (
    <div className='flex  border-r border-r-gray-300 '>
      <ProSidebar
        collapsed={false}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        breakPoint='md'
        backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 1)}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div className='flex flex-col h-full'>
          {/* <Switch
            id='collapse'
            checked={collapsed}
            onChange={() => setCollapsed(!collapsed)}
            title='Toggle'
          /> */}
          <div className='flex-1 mt-8'>
            <div className='py-6 '>
              {/* <Typography
                variant='body2'
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                General
              </Typography> */}
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              {sidebarMenu.map((item) => (
                <MenuItem
                  key={`sbmn-${item.title}`}
                  active={pathname === item.route}
                  className={clsx(
                    '!text-sm',
                    pathname === item.route
                      ? 'bg-emerald-50 text-primary [&_svg]:fill-primary font-semibold border border-primary border-r-0'
                      : '!text-dark-main !font-light',
                  )}
                  icon={item.icon}
                >
                  {item.title}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
      </ProSidebar>
    </div>
  );
}
