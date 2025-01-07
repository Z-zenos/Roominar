'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../Sidebar';
import { Collapsible } from '../Collapsible';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import EventIcon from '@/public/icons/event.svg';
import ProfileIcon from '@/public/icons/profile.svg';
import NotificationIcon from '@/public/icons/notification.svg';
import AccountSettingIcon from '@/public/icons/account-settings.svg';
import PaymentIcon from '@/public/icons/payment.svg';

const sidebarMenu = [
  {
    title: 'Personal Info',
    url: '/my-profile',
    icon: <ProfileIcon />,
    isActive: false,
  },
  {
    title: 'Account Settings',
    url: '/account-settings',
    icon: <AccountSettingIcon />,
    isActive: false,
  },
  {
    title: 'My Events',
    url: '/my-events',
    icon: <EventIcon />,
    isActive: false,
  },
  {
    title: 'Ticket & payments',
    url: '/payments',
    icon: <PaymentIcon />,
    isActive: false,
  },
  {
    title: 'Notifications',
    url: '/notifications',
    icon: <NotificationIcon />,
    isActive: false,
  },
];

export default function AudienceSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      variant='sidebar'
      collapsible='icon'
      className='sticky h-screen'
      {...props}
    >
      <SidebarContent className='bg-slate-50 border-l border-l-primary'>
        <SidebarGroup className='p-0'>
          <SidebarMenu className='mt-20'>
            {sidebarMenu.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={clsx(
                      '!text-sm py-6 my-1',
                      pathname.includes(item.url)
                        ? 'bg-emerald-50 !text-primary [&_svg]:fill-primary [&_g]:fill-primary [&_path]:stroke-primary font-semibold border border-primary border-l-0 rounded-none'
                        : '!text-dark-main !font-light',
                    )}
                  >
                    <a
                      href={item.url}
                      className='[&_svg]:w-[30px] [&_svg]:h-[30px]'
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* <NavProjects projects={data.projects} />
        <NavSecondary
          items={data.navSecondary}
          className='mt-auto'
        /> */}
      </SidebarContent>
    </Sidebar>
  );
}
