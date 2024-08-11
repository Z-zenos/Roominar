'use client';

import InputSelectCommon from '@/src/component/form/InputSelectCommon';
import InputTextFieldCommon from '@/src/component/form/InputTextFieldCommon';
import { messageValidate } from '@/src/constant/message.constant';
import useLoading from '@/src/hook/useLoading';
import { getRouter } from '@/src/util/app.util';
import { toastError } from '@/src/util/toast.util';
import Button from '@mui/material/Button';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

interface ILoginViewProps {
  username: string;
  password: string;
  roleCode: any;
}

export default function LoginView() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [, setLoading] = useLoading();

  const onSubmit = (value: ILoginViewProps) => {
    const { username, password, roleCode } = value;
    setLoading(true);
    signIn('credentials', {
      username,
      password,
      roleCode: roleCode,
      redirect: false,
      callbackUrl: searchParams.get('callbackUrl'),
    }).then(({ ok, error, status }) => {
      setLoading(false);
      if (ok) {
        router.push(getRouter('home'));
      } else {
        const bodyStartIndex = error.indexOf('Body: ');
        const bodyEndIndex = error.indexOf('}', bodyStartIndex) + 1;
        const bodyString = error.substring(bodyStartIndex + 6, bodyEndIndex);
        const parsedBody = JSON?.parse(bodyString);
        const { message } = parsedBody;
        toastError(message || 'something error');
      }
    });
  };
  return (
    <div className='flex items-center justify-center flex-1 bg-white'>
      <div className='text-[14px]'>
        <form onSubmit={handleSubmit(onSubmit)} className='w-[500px]'>
          <h1 className='text-[18px]'>ログイン</h1>
          <div className='mt-[30px] '>
            <InputTextFieldCommon
              control={control}
              name='username'
              className='w-[500px]'
              label='LoginID'
              variant='outlined'
              rules={{
                required: {
                  value: true,
                  message: messageValidate.requiredField('LoginID'),
                },
              }}
            />
          </div>
          <div className='mt-[15px]'>
            <InputTextFieldCommon
              control={control}
              name='password'
              type='password'
              className='w-[500px]'
              label='Password'
              variant='outlined'
              rules={{
                required: {
                  value: true,
                  message: messageValidate.requiredField('Password'),
                },
              }}
            />
          </div>
          <div className='mt-[15px]'>
            <InputSelectCommon
              control={control}
              name='roleCode'
              className='w-[500px]'
              label='Role'
              variant='outlined'
              options={[
                { label: 'Patient', value: 'PATIENT' },
                { label: 'Admin', value: 'ADMIN' },
              ]}
              rules={{
                required: {
                  value: true,
                  message: messageValidate.requiredField('Role'),
                },
              }}
            />
          </div>
          <div className='mt-[15px] text-left'>
            <Button variant='contained' type='submit'>
              ログイン
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
