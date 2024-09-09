import ForgotPasswordForm from '@/src/component/form/ForgotPasswordForm';
import { TbPasswordFingerprint } from 'react-icons/tb';

async function Page() {
  return (
    <div className='mx-auto w-[500px] pt-[2%] pb-[5%]'>
      <TbPasswordFingerprint
        className='mx-auto text-primary mb-5'
        size={50}
      />
      <h2 className='text-primary text-lg font-semibold'>Forgot password ?</h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        No worries, we&apos;ll send you reset instructions to email associated
        with your account.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}

export default Page;
