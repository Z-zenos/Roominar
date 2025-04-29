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
    <div className='1400px:px-[15%] px-[5%] 400px:py-0 py-4 w-full overflow-hidden'>
      <div className='lg:w-[800px] w-full mx-auto mt-4'>
        <Alert className='w-full'>
          <MdOutlineSecurity className='h-5 w-5' />
          <AlertTitle>Login & Security</AlertTitle>
          <AlertDescription className='font-light opacity-60 text-sm'>
            Keeping your account secure. We regularly review accounts to make
            sure they’re secure as possible. We’ll also let you know if there’s
            more we can do to increase the security of your account.
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
