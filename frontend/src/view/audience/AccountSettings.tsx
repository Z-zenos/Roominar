'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/src/component/common/Alert';
import ChangeEmailForm from '@/src/component/form/ChangeEmailForm';
import ChangePasswordForm from '@/src/component/form/ChangePasswordForm';
import { MdOutlineSecurity } from 'react-icons/md';

function AccountSetting() {
  return (
    <div className='1400px:px-[15%] px-[5%] 450px:py-0 py-4 w-full overflow-hidden'>
      <div className='lg:w-[800px] w-full mx-auto mt-4'>
        <Alert className='w-full'>
          <MdOutlineSecurity className='h-5 w-5' />
          <AlertTitle>Đăng nhập & Bảo mật</AlertTitle>
          <AlertDescription className='font-light opacity-60 text-sm'>
            Giữ an toàn cho tài khoản của bạn. Chúng tôi thường xuyên xem xét
            các tài khoản để đảm bảo chúng được bảo mật nhất có thể. Chúng tôi
            cũng sẽ thông báo cho bạn nếu có thêm điều gì chúng tôi có thể làm
            để tăng cường bảo mật cho tài khoản của bạn.
          </AlertDescription>
        </Alert>

        <div>
          <ChangeEmailForm />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default AccountSetting;
