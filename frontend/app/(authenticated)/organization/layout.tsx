'use client';

import { Separator } from '@/src/component/common/Separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/src/component/common/Sidebar';
import { OrganizationSidebar } from '@/src/component/common/SideBar/OrganizationSidebar';

export default function RootLayout({ children }) {
  return (
    <div className='flex w-full h-full'>
      <SidebarProvider>
        <OrganizationSidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator
                orientation='vertical'
                className='mr-2 h-4'
              />
            </div>
          </header>
          <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
            <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min'>
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
