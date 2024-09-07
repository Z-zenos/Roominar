import ForgotPasswordForm from '@/src/component/form/ForgotPasswordForm';

async function Page() {
  return (
    <div className='mx-auto w-[500px] py-[5%]'>
      <h2 className='text-primary text-lg font-semibold'>
        Forgot your password
      </h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Enter your email to receive instructions to reset your password.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}

export default Page;
