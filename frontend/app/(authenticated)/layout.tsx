'use client';

import Navbar from '@/src/component/common/Navbar';
import Sidebar from '@/src/component/common/Sidebar';
import Footer from '@/src/component/layout/Footer';
// import useWindowDimensions from '@/src/hook/useWindowDimension';
// import { Switch } from '@nextui-org/switch';
// import clsx from 'clsx';
// import { useState } from 'react';

export default function RootLayout({ children }) {
  // const [collapsed, setCollapsed] = useState<boolean>(false);
  // const { width } = useWindowDimensions();

  return (
    <div>
      <Navbar />
      <div className='flex 1400px:px-[15%] px-0 w-full h-full'>
        <Sidebar collapsed={false} />
        <div className='flex-1 min-h-[calc(100vh-64px)] overflow-auto px-6 py-10 bg-slate-50'>
          {/* <Switch
            id='collapse'
            checked={collapsed}
            onChange={() => setCollapsed(!collapsed)}
            className={clsx('ml-10', width > 800 && 'hidden')}
          /> */}
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
