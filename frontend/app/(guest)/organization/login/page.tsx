import Button from '@/src/component/common/Button/Button';
import LoginForm from '@/src/component/form/LoginForm';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';

export default async function Page() {
  return (
    <div className='mx-auto 450px:w-[700px] w-full py-[5%] 450px:px-auto px-[5%] overflow-x-hidden'>
      <h2 className='text-primary text-lg font-semibold'>
        Ngày mới tốt lành 👋🏻
      </h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Đi đến trang tổ chức của bạn 🏢 và tổ chức những sự kiện tuyệt vời cho
        mọi người trên toàn thế giới.
      </p>
      <LoginForm roleCode='ORGANIZER' />

      <div
        className={clsx(
          'mt-6 font-light flex justify-center items-center flex-col',
        )}
      >
        <p>Bạn chưa có tài khoản tổ chức?</p>
        <Button className='outline-none group mt-3'>
          <Link
            href='/organization/register'
            className='text-white group-hover:text-primary'
          >
            Đăng ký ngay
          </Link>
        </Button>
      </div>
    </div>
  );
}
