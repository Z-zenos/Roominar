'use client';

import { useGetTotalUnreadNotificationsQuery } from '@/src/api/user.api';
import { NotificationList } from '@/src/component/common/Notification';
import { Separator } from '@/src/component/common/Separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from '@/src/component/common/Sheet';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/src/component/common/Sidebar';
import { OrganizationSidebar } from '@/src/component/common/SideBar/OrganizationSidebar';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { CiBellOn } from 'react-icons/ci';

export default function RootLayout({ children }) {
  const { width } = useWindowDimensions();
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  const { status } = useSession();
  const {
    data: totalUnreadNotifications,
    refetch: refetchTotalUnreadNotifications,
  } = useGetTotalUnreadNotificationsQuery(status === 'authenticated');
  return (
    <Sheet
      open={isNotificationOpen}
      onOpenChange={setIsNotificationOpen}
    >
      <div className='flex w-full h-full'>
        <SidebarProvider open={width > 1200 ? true : false}>
          <OrganizationSidebar />
          <SidebarInset>
            <header className='flex h-16 shrink-0 w-full items-center justify-between gap-2 pr-6'>
              <div className='flex items-center gap-2 px-4'>
                <SidebarTrigger className='-ml-1' />
                <Separator
                  orientation='vertical'
                  className='mr-2 h-4'
                />
              </div>
              {status === 'authenticated' && (
                <SheetTrigger className='relative cursor-pointer mr-2'>
                  <CiBellOn className='w-7 h-7' />
                  {totalUnreadNotifications > 0 && (
                    <span
                      className={clsx(
                        'absolute -top-2 -right-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs',
                        totalUnreadNotifications === 0 ? 'hidden' : 'block',
                        totalUnreadNotifications > 99 && 'w-8 h-5',
                        totalUnreadNotifications > 9 && 'w-6 h-5 -right-3',
                        totalUnreadNotifications <= 9 && 'w-5 h-5',
                      )}
                    >
                      {totalUnreadNotifications}
                      {totalUnreadNotifications > 99 && '+'}
                    </span>
                  )}
                </SheetTrigger>
              )}
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
              <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min'>
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>

        <SheetOverlay>
          <SheetContent
            side='right'
            className='min-w-[400px]'
          >
            <SheetHeader>
              <SheetTitle className='text-primary'>Notifications</SheetTitle>
              <SheetDescription />
              <NotificationList
                onRefetch={refetchTotalUnreadNotifications}
                onClose={() => setIsNotificationOpen(false)}
              />
            </SheetHeader>
          </SheetContent>
        </SheetOverlay>
      </div>
    </Sheet>
  );
}
