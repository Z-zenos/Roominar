import Logo from '@/src/component/common/Logo';
import AudRegisterForm from '@/src/component/form/AudRegisterForm';

async function Page() {
  return (
    <div className='mx-auto w-[500px] py-[5%]'>
      <h2 className='text-primary text-lg font-semibold'>
        Welcome to <Logo /> 👋🏻
      </h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Enter to get interesting event & webinar & seminar you like.
      </p>
      <AudRegisterForm />
    </div>
  );
}

export default Page;
