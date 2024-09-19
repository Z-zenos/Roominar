'use client';

import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useVerifyChangeEmailMutation } from '@/src/api/auth.api';
import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/react';
import clsx from 'clsx';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/src/component/common/Alert';

interface ChangeEmailSuccessProps {
  token: string;
}

function ChangeEmailSuccess({ token }: ChangeEmailSuccessProps) {
  const router = useRouter();
  const [text, setText] = useState<string>('Checking...');
  const [isSuccess, setIsSuccess] = useState<boolean>(null);

  const { trigger } = useVerifyChangeEmailMutation({
    onSuccess() {
      setText('Your new email changed successfully ✔');
      setIsSuccess(true);
      toast.success('Your new email has verified completely!');
      router.push('/login');
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
      setIsSuccess(false);
      setText((error.body as ErrorResponse400)?.message);
    },
  });

  useEffect(() => {
    trigger({
      token,
    });
  }, [trigger, token]);

  return (
    <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <Alert>
          <Image
            src={isSuccess ? '/images/change_email.png' : '/images/invalid.png'}
            width={isSuccess ? 160 : 100}
            alt='not found image'
            classNames={{
              wrapper:
                'block mx-auto my-4 flex items-center justify-center text-gray-100',
            }}
          />
          <AlertTitle className='text-xm font-light'>
            Change New Email
          </AlertTitle>
          <AlertDescription
            className={clsx(
              'mt-4 text-md font-semibold tracking-tight',
              isSuccess
                ? 'text-green-500'
                : isSuccess === null
                  ? 'text-primary'
                  : 'text-red-500',
            )}
          >
            {text}
          </AlertDescription>
        </Alert>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <a
            href='/home'
            className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Go back home
          </a>
          <a
            href='#'
            className='text-sm font-semibold text-gray-900'
          >
            Contact support <span aria-hidden='true'>&rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}

export default ChangeEmailSuccess;
