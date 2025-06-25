import ResetPasswordForm from '@/src/component/form/ResetPasswordForm';
import { MdLockReset } from 'react-icons/md';

async function Page({ params: { token } }: { params: { token: string } }) {
  return (
    <div className='mx-auto w-[500px] pt-[2%] pb-[5%]'>
      <MdLockReset
        className='mx-auto text-primary mb-5'
        size={50}
      />
      <h2 className='text-primary text-lg font-semibold'>Đặt lại mật khẩu</h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Một bước nữa để truy cập tài khoản của bạn.
      </p>
      <ResetPasswordForm token={token} />
    </div>
  );
}

export default Page;
