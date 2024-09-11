import Sidebar from '@/src/component/common/Sidebar';
import Header from '@/src/component/layout/Header';

export default async function Layout({ children }) {
  return (
    <div className=''>
      <div className='flex w-full h-full'>
        <Sidebar />
        <div className='grow min-h-[calc(100vh-64px)] bg-[#e8f6ff] overflow-auto'>
          <Header
            hasLogo={false}
            className='px-[5%]'
          />
          <div className='p-10 bg-white m-6 rounded-md shadow-[rgba(0,_0,_0,_0.1)_0px_1px_3px_0px,_rgba(0,_0,_0,_0.06)_0px_1px_2px_0px]'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
