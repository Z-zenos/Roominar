'use client';

import ChangeEmailForm from '@/src/component/form/ChangeEmailForm';
import ChangePasswordForm from '@/src/component/form/ChangePasswordForm';
import { styles } from '@/src/constant/styles.constant';
import clsx from 'clsx';

function AccountSetting() {
  return (
    <div className='1400px:px-[15%] px-0 w-full'>
      <div className='lg:w-[800px] w-full mx-auto'>
        <div
          className={clsx(styles.between, 'py-5 border-b border-b-slate-300')}
        >
          <div>
            <h3 className='text-xm font-semibold mb-1'>Login & Security</h3>
            <p className='opacity-50 font-light text-sm'>
              Keeping your account secure. We regularly review accounts to make
              sure they’re secure as possible. We’ll also let you know if
              there’s more we can do to increase the security of your account.
            </p>
          </div>
        </div>

        <div>
          <ChangeEmailForm />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default AccountSetting;
