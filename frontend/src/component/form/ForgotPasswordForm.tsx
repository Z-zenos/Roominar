'use client';

import { useForm } from 'react-hook-form';
import { AiFillFacebook } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiMail } from 'react-icons/hi';
import clsx from 'clsx';
import { Link } from '@nextui-org/link';
import { Form, FormInput } from './Form';
import { styles } from '@/src/constant/styles.constant';
import Button from '../common/Button/Button';
import type { ForgotPasswordFormSchema } from '@/src/schemas/auth/ForgotPasswordFormSchema';
import { forgotPasswordFormSchema } from '@/src/schemas/auth/ForgotPasswordFormSchema';
import { signIn } from 'next-auth/react';
import { useForgotPasswordMutation } from '@/src/api/auth.api';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import { RoleCode } from '@/src/constant/role_code.constant';
import { FaArrowLeft } from 'react-icons/fa6';
import { useState } from 'react';
import { Image } from '@nextui-org/react';

export default function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const form = useForm<ForgotPasswordFormSchema>({
    mode: 'all',
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordFormSchema),
  });

  const { trigger, isMutating } = useForgotPasswordMutation({
    onSuccess() {
      setIsSuccess(true);
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  const handleForgotPassword = form.handleSubmit(
    (data: ForgotPasswordFormSchema) => {
      trigger({
        forgotPasswordRequest: {
          email: data?.email,
          roleCode: RoleCode.AUDIENCE,
        },
      });
    },
  );

  return (
    <Form {...form}>
      <form
        onSubmit={(data) => {
          if (form.formState.isValid) {
            handleForgotPassword(data);
          }
        }}
        className={clsx('flex items-center justify-center flex-col')}
      >
        {isSuccess ? (
          <div className='border rounded-md text-info-main border-info-main p-6'>
            <Image
              width={100}
              height={100}
              src='/images/mail-truck.gif'
              alt='mail truck'
              classNames={{ wrapper: 'mx-auto' }}
            />
            Please check reset password instructions we sent to your email.
          </div>
        ) : (
          <>
            <div className='w-full'>
              <FormInput
                id='email'
                name='email'
                label='email'
                type='email'
                required
                rightIcon={
                  <HiMail
                    size={20}
                    className='text-primary'
                  />
                }
                placeholder='youremail@gmail.com'
                control={form.control}
                showError={true}
              />
            </div>

            <Button
              title='Require reset password'
              type='submit'
              className='w-full mt-5'
              disabled={!form.formState.isValid || !form.formState.isDirty}
              isLoading={isMutating}
            />
          </>
        )}
        <br />
        <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
          Or join with
        </h5>
        <div className='flex items-center justify-center mt-3'>
          <FcGoogle
            size={30}
            className='cursor-pointer mr-2'
            onClick={() => signIn('google', { callbackUrl: '/home' })}
          />
          <AiFillFacebook
            size={30}
            className='cursor-pointer ml-2 text-[#1877F2]'
            onClick={() => signIn('facebook')}
          />
        </div>
        <h5 className='text-center pt-4 font-Poppins text-nm font-light'>
          Not have any account?
          <Link
            href='/register'
            className='text-primary font-semibold pl-1 cursor-pointer'
          >
            Sign up
          </Link>
        </h5>

        <Link
          className={clsx(
            styles.flexStart,
            'gap-2 opacity-60 mb-5 cursor-pointer hover:bg-slate-100 transition-all py-3 px-5 pl-2 inline-flex group text-black mx-auto',
          )}
          href='/login'
        >
          <FaArrowLeft
            size={16}
            className='group-hover:-translate-x-2 transition-all'
          />
          <span>Back to login</span>
        </Link>
      </form>
    </Form>
  );
}
