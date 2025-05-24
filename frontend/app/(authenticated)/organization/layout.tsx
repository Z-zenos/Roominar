'use client';

import { useGetTotalUnreadNotificationsQuery } from '@/src/api/user.api';
import { NotificationIcon } from '@/src/component/common/Notification';
import { Separator } from '@/src/component/common/Separator';
import { Sheet, SheetTrigger } from '@/src/component/common/Sheet';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/src/component/common/Sidebar';
import { OrganizationSidebar } from '@/src/component/common/SideBar/OrganizationSidebar';
import {
  RightSidebarProvider,
  useRightSidebar,
} from '@/src/contexts/RightSidebarContext';
import OrganizationDynamicBar from '@/src/view/organization/OrganizationDynamicBar';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const LazyRightSidebar = dynamic(
  () => import('@/src/view/organization/OrganizationRightSidebar'),
  {
    ssr: false,
  },
);

// This is the inner component that will use the context
function LayoutContent({ children }) {
  const { status } = useSession();
  const {
    data: totalUnreadNotifications,
    refetch: refetchTotalUnreadNotifications,
  } = useGetTotalUnreadNotificationsQuery(status === 'authenticated');
  const { open, isOpen, close } = useRightSidebar();

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <div className='flex w-full h-full'>
        <SidebarProvider defaultOpen={true}>
          <OrganizationSidebar />
          <SidebarInset>
            <header className='flex h-16 shrink-0 w-full items-center justify-between gap-2 pr-6'>
              <div className='flex items-center gap-2 px-4'>
                <SidebarTrigger className='-ml-1' />
                <Separator
                  orientation='vertical'
                  className='mr-2 h-4'
                />
                <OrganizationDynamicBar />
              </div>
              {status === 'authenticated' && (
                <SheetTrigger
                  className='relative cursor-pointer mr-2'
                  onClick={() => open('NOTIFICATION_LIST')}
                >
                  <NotificationIcon
                    totalUnreadNotifications={totalUnreadNotifications}
                  />
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

        <LazyRightSidebar refetch={refetchTotalUnreadNotifications} />
      </div>
    </Sheet>
  );
}

// The outer component that provides the context
export default function RootLayout({ children }) {
  return (
    <RightSidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </RightSidebarProvider>
  );
}
