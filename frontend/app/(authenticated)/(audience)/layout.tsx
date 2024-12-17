'use client';

import Navbar from '@/src/component/common/Navbar';
import { Separator } from '@/src/component/common/Separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/src/component/common/Sidebar';
import AudienceSidebar from '@/src/component/common/SideBar/AudienceSidebar';
import Footer from '@/src/component/layout/Footer';

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />

      <div className='flex 1400px:px-[15%] px-0 w-full'>
        <SidebarProvider>
          <AudienceSidebar />
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
              <div className='flex-1 rounded-xl bg-muted/50'>{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}
