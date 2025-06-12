import Button from '@/src/component/common/Button/Button';
import LoginForm from '@/src/component/form/LoginForm';
import { styles } from '@/src/constants/styles.constant';
import SocialLogin from '@/src/view/auth/SocialLogin';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';

async function Page() {
  return (
    <div className='mx-auto 450px:w-[700px] w-full py-[5%] 450px:px-auto px-[5%] overflow-hidden'>
      <h2 className='text-primary text-lg font-semibold'>
        Ngày mới tốt lành 👋🏻
      </h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Hãy đăng nhập để nhận những sự kiện, hội thảo, buổi nói chuyện thú vị mà
        bạn thích.
      </p>
      <LoginForm roleCode='AUDIENCE' />

      <div>
        <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
          Hoặc đăng nhập bằng
        </h5>
        <SocialLogin />
        <h5 className='text-center pt-4 font-Poppins text-nm font-light'>
          Bạn chưa có tài khoản?
          <Link
            href='/register'
            className='text-primary font-semibold pl-1 cursor-pointer'
          >
            Đăng ký ngay
          </Link>
        </h5>

        <div className={clsx('mt-4 gap-2 font-light', styles.center)}>
          Bạn muốn tự tổ chức một sự kiện của riêng mình?
          <Button className='outline-none group'>
            <Link
              href='/organization/login'
              className='text-white group-hover:text-primary'
            >
              Đi đến trang tổ chức
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
