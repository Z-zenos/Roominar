'use client';

import Navbar from '@/src/component/common/Navbar';
import Sidebar from '@/src/component/common/Sidebar';
import Footer from '@/src/component/layout/Footer';

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className='flex 1400px:px-[15%] px-0 w-full h-full'>
        <Sidebar />
        <div className='flex-1 min-h-[calc(100vh-64px)] overflow-auto px-6 py-10 bg-slate-50'>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
