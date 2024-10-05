'use client';

import OrganizationSidebar from '@/src/component/common/SideBar/OrganizationSidebar';

export default function RootLayout({ children }) {
  return (
    <div className='flex w-full h-full'>
      <OrganizationSidebar />
      <div className='flex-1 min-h-[calc(100vh-64px)] overflow-auto px-6 py-10 bg-[#f7f7fa]'>
        {children}
      </div>
    </div>
  );
}
