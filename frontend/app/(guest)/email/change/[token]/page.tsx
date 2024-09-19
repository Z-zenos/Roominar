import ChangeEmailSuccess from '@/src/view/auth/ChangeEmailSuccess';

async function Page({ params: { token } }: { params: { token: string } }) {
  return (
    <div className='px-[15%] text-center'>
      <ChangeEmailSuccess token={token} />
    </div>
  );
}

export default Page;
