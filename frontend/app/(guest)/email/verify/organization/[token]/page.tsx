import Logo from '@/src/component/common/Logo';
import VerifyOrganization from '@/src/view/organization/VerifyOrganization';

async function Page({ params: { token } }: { params: { token: string } }) {
  return (
    <div className='px-[15%] py-[100px] text-center'>
      <h2 className='text-primary text-lg font-semibold'>
        Welcome to <Logo /> 👋🏻
      </h2>
      <VerifyOrganization token={token} />
    </div>
  );
}

export default Page;
