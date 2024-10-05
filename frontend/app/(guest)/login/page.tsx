import Button from '@/src/component/common/Button/Button';
import LoginForm from '@/src/component/form/LoginForm';
import { styles } from '@/src/constant/styles.constant';
import SocialLogin from '@/src/view/auth/SocialLogin';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';

async function Page() {
  return (
    <div className='mx-auto w-[500px] py-[5%]'>
      <h2 className='text-primary text-lg font-semibold'>Welcome back 👋🏻</h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Enter to get interesting event & webinar & seminar you like.
      </p>
      <LoginForm roleCode='AUDIENCE' />

      <div>
        <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
          Or join with
        </h5>
        <SocialLogin />
        <h5 className='text-center pt-4 font-Poppins text-nm font-light'>
          Not have any account?
          <Link
            href='/register'
            className='text-primary font-semibold pl-1 cursor-pointer'
          >
            Sign up
          </Link>
        </h5>

        <div className={clsx('mt-4 gap-2 font-light', styles.center)}>
          Want to host your own event?
          <Button className='outline-none group'>
            <Link
              href='/organization/login'
              className='text-white group-hover:text-primary'
            >
              Navigate to organization
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
