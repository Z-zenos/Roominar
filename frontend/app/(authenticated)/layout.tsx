import Header from '@/src/component/layout/Header';
import Sidebar from '@/src/component/layout/Sidebar';

export default async function Layout({ children }) {
  return (
    <div className=''>
      <Header />
      <div className='flex w-full h-full'>
        <Sidebar />
        <div className='grow min-h-[calc(100vh-64px)] bg-[#e8f6ff] overflow-auto p-6'>{children}</div>
      </div>
    </div>
  );
}
