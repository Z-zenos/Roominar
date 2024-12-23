'use client';

import * as React from 'react';
import { ChevronRight, Command } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../Sidebar';
import { SidebarSettings } from './SidebarSettings';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../Collapsible';
import OverviewIcon from '@/public/icons/overview.svg';
import EventPlanningIcon from '@/public/icons/event-planning.svg';
import CreateEventIcon from '@/public/icons/create-event.svg';
import AttendeesIcon from '@/public/icons/attendees.svg';
import StaffIcon from '@/public/icons/staff.svg';
import SurveyIcon from '@/public/icons/survey.svg';
import TicketPaymentIcon from '@/public/icons/ticket-payment.svg';
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { RoleCode } from '@/src/constants/role_code.constant';
import type { Session } from 'next-auth';
import clsx from 'clsx';

const sidebarMenu = [
  {
    title: 'Overview',
    url: '/organization/overview',
    icon: <OverviewIcon />,
    isActive: false,
  },
  {
    title: 'Events',
    url: '/organization/events',
    icon: <EventPlanningIcon />,
    isActive: true,
    items: [
      {
        title: 'Create New',
        url: '/organization/events/create',
        icon: <CreateEventIcon />,
      },
      {
        title: 'Explorer',
        url: '#',
      },
    ],
  },
  {
    title: 'Attendees',
    icon: <AttendeesIcon />,
    url: '/organization/attendees',
  },
  {
    title: 'Ticket & payments',
    icon: <TicketPaymentIcon />,
    url: '/organization/ticket-payments',
  },
  {
    title: 'Survey',
    icon: <SurveyIcon />,
    url: '/organization/surveys',
  },
  {
    title: 'Staff',
    icon: <StaffIcon />,
    url: '/organization/staff',
  },
];

export function OrganizationSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: auth } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async (auth: Session) => {
    localStorage.setItem('rememberMe', 'false');

    // Ensure signOut runs and resolves before reloading or refreshing
    try {
      if (process.env.NODE_ENV === 'development') {
        await signOut({ redirect: false });
        location.reload();
      } else {
        await signOut(
          auth.user?.roleCode === RoleCode.ORGANIZER
            ? // ? { callbackUrl: '/organization/login' }
              { callbackUrl: '/home' }
            : { callbackUrl: '/home' },
        );
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Ensure the refresh and reload happen only after signOut resolves
      router.refresh();
      location.reload();
    }
  };

  return (
    <Sidebar
      variant='inset'
      collapsible='icon'
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
            >
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Acme Inc</span>
                  <span className='truncate text-xs'>Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
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
                      '!text-sm',
                      pathname.includes(item.url)
                        ? 'bg-emerald-50 !text-primary [&_svg]:fill-primary [&_g]:fill-primary [&_path]:stroke-primary font-semibold border border-primary rounded-sm'
                        : '!text-dark-main !font-light',
                    )}
                  >
                    <a
                      href={item.url}
                      className='[&_svg]:w-[25px] [&_svg]:h-[25px]'
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className='data-[state=open]:rotate-90'>
                          <ChevronRight />
                          <span className='sr-only'>Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={clsx(
                                  pathname.includes(subItem.url)
                                    ? 'text-primary [&_svg]:fill-primary [&_g]:fill-primary [&_path]:stroke-primary font-medium rounded-none border-b border-b-primary'
                                    : '!text-dark-main !font-light',
                                )}
                              >
                                <a
                                  href={subItem.url}
                                  className='[&_svg]:w-[25px] [&_svg]:h-[25px]'
                                >
                                  {/* {subItem.icon} */}
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
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
      <SidebarFooter>
        <SidebarSettings
          user={auth?.user}
          onLogout={() => handleLogout(auth)}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
