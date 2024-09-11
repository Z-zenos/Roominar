'use client';

import React from 'react';
import type { MenuItemStyles } from 'react-pro-sidebar';
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  menuClasses,
} from 'react-pro-sidebar';
import Logo from './Logo';
import { styles } from '@/src/constant/styles.constant';
import clsx from 'clsx';
import { FaUserCog } from 'react-icons/fa';

type Theme = 'light' | 'dark';

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#ffffff',
      color: '#607489',
    },
    menu: {
      menuContent: '#fbfcfd',
      icon: '#0056D2',
      hover: {
        backgroundColor: '#c5e4ff',
        color: '#0056D2',
      },
      disabled: {
        color: '#9fb6cf',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#0b2948',
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

export default function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>('light');

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
          ? hexToRgba(
              themes[theme].menu.menuContent,
              hasImage && !collapsed ? 0.4 : 1,
            )
          : 'transparent',
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          hasImage ? 0.8 : 1,
        ),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <ProSidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        breakPoint='md'
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.9 : 1,
        )}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div className={clsx(styles.center)}>
            {collapsed ? (
              <p
                className='
                  w-9 min-w-9 h-9 m-h-9 mt-6 flex items-center justify-center
                  rounded-md text-white text-lg font-bold bg-blue-main
                  bg-[linear-gradient(45deg,_rgb(21_87_205)_0%,_rgb(90_225_255)_100%)]'
              >
                R
              </p>
            ) : (
              <Logo />
            )}
          </div>

          {/* <Switch
            id='collapse'
            checked={collapsed}
            onChange={() => setCollapsed(!collapsed)}
            title='Toggle'
          /> */}
          <div style={{ flex: 1, marginTop: '32px' }}>
            <div style={{ padding: '0 24px', marginBottom: '8px' }}>
              {/* <Typography
                variant='body2'
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
              >
                General
              </Typography> */}
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                icon={<FaUserCog size={20} />}
                // suffix={<Badge variant='success'>New</Badge>}
              >
                Profile
              </MenuItem>
            </Menu>
          </div>
          {/* <SidebarFooter collapsed={collapsed} /> */}
        </div>
      </ProSidebar>
    </div>
  );
}
