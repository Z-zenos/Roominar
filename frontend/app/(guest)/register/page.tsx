import RegisterAudienceForm from '@/src/component/form/RegisterAudienceForm';

async function Page() {
  return (
    <div className='mx-auto 400px:w-[700px] w-full 400px:px-auto px-[5%] py-[5%]'>
      <h2 className='text-primary text-lg font-semibold flex justify-start items-center gap-3'>
        Welcome 👋🏻
      </h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Enter to get interesting event & webinar & seminar you like.
      </p>
      <RegisterAudienceForm />
    </div>
  );
}

export default Page;
