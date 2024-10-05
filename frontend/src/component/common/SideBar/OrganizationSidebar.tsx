'use client';

import React from 'react';
import type { MenuItemStyles } from 'react-pro-sidebar';
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  menuClasses,
} from 'react-pro-sidebar';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import OverviewIcon from '@/public/icons/overview.svg';
import EventPlanningIcon from '@/public/icons/event-planning.svg';
import AttendeesIcon from '@/public/icons/attendees.svg';
import StaffIcon from '@/public/icons/staff.svg';
import SurveyIcon from '@/public/icons/survey.svg';
import TicketPaymentIcon from '@/public/icons/ticket-payment.svg';
import useWindowDimensions from '@/src/hook/useWindowDimension';
import { useState } from 'react';
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from 'react-icons/tb';
import { styles } from '@/src/constant/styles.constant';
import Logo from '../Logo';

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
    title: 'Overview',
    icon: <OverviewIcon width={25} />,
    route: '/organization/overview',
  },
  {
    title: 'Events',
    icon: <EventPlanningIcon width={25} />,
    route: '/organization/events',
  },
  {
    title: 'Attendees',
    icon: <AttendeesIcon width={25} />,
    route: '/organization/attendees',
  },
  {
    title: 'Ticket & payments',
    icon: <TicketPaymentIcon width={25} />,
    route: '/organization/ticket-payments',
  },
  {
    title: 'Survey',
    icon: <SurveyIcon width={25} />,
    route: '/organization/survey',
  },
  {
    title: 'Staff',
    icon: <StaffIcon width={25} />,
    route: '/organization/staff',
  },
];

const theme = 'light';

interface OrganizationSidebarProps {
  className?: string;
}

export default function OrganizationSidebar({
  className,
}: OrganizationSidebarProps) {
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

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  const router = useRouter();

  return (
    <div className={clsx('flex', className)}>
      <ProSidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        breakPoint='md'
        backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 1)}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div className='flex flex-col h-full'>
          <div className={clsx(styles.center, 'gap-2 mt-2')}>
            {!collapsed && <Logo className='w-[160px]' />}
            {!collapsed ? (
              <TbLayoutSidebarLeftCollapse
                className='w-6 h-6 cursor-pointer text-primary mt-2'
                onClick={() => setCollapsed(true)}
              />
            ) : (
              <TbLayoutSidebarRightCollapse
                className='w-6 h-6 cursor-pointer text-primary mt-2'
                onClick={() => {
                  setCollapsed(false);
                }}
              />
            )}
          </div>
          <div className={clsx(collapsed ? 'ml-0' : '', 'flex-1 mt-[100px]')}>
            <Menu menuItemStyles={menuItemStyles}>
              {sidebarMenu.map((item) => (
                <MenuItem
                  key={`osbmn-${item.title}`}
                  active={pathname === item.route}
                  className={clsx(
                    '!text-sm',
                    pathname === item.route
                      ? 'bg-emerald-50 text-primary [&_svg]:fill-primary [&_g]:fill-primary [&_path]:stroke-primary font-semibold border border-primary border-r-0'
                      : '!text-dark-main !font-light',
                  )}
                  icon={item.icon}
                  onClick={() => router.push(item.route)}
                >
                  {!collapsed && item.title}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
      </ProSidebar>
    </div>
  );
}
