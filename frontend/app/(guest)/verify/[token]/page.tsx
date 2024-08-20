import Logo from '@/src/component/common/Logo';
import ImproveExperienceForm from '@/src/component/form/ImproveAudienceExperienceForm';

async function Page({ params: { token } }: { params: { token: string } }) {
  return (
    <div className='px-[15%] py-[100px] text-center'>
      <h2 className='text-primary text-lg font-semibold'>
        Welcome to <Logo /> 👋🏻
      </h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Enter to get interesting event & webinar & seminar you like.
      </p>
      <ImproveExperienceForm token={token} />
    </div>
  );
}

export default Page;
