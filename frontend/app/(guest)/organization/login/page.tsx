import Button from '@/src/component/common/Button/Button';
import LoginForm from '@/src/component/form/LoginForm';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';

export default async function Page() {
  return (
    <div className='mx-auto w-[500px] py-[5%]'>
      <h2 className='text-primary text-lg font-semibold'>Welcome back 👋🏻</h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Jump into your organization 🏢 and host awesome events for every one
        over the world.
      </p>
      <LoginForm roleCode='ORGANIZER' />

      <div
        className={clsx(
          'mt-6 font-light flex justify-center items-center flex-col',
        )}
      >
        <p>Want to create your own organization?</p>
        <Button className='outline-none group mt-3'>
          <Link
            href='/organization/register'
            className='text-white group-hover:text-primary'
          >
            Create new organization
          </Link>
        </Button>
      </div>
    </div>
  );
}
