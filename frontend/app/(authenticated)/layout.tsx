import Navbar from '@/src/component/common/Navbar';
import Sidebar from '@/src/component/common/Sidebar';

export default async function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className='flex 1400px:px-[15%] px-0 w-full h-full'>
        <Sidebar />
        <div className='flex-1 min-h-[calc(100vh-64px)] overflow-auto p-6 '>
          {children}
        </div>
      </div>
    </div>
  );
}
