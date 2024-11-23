'use client';

import { useForm } from 'react-hook-form';
import {
  AiFillFacebook,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Link } from '@nextui-org/link';
import { Form, FormInput } from './Form';
import Button from '../common/Button/Button';
import { signIn } from 'next-auth/react';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import { useState } from 'react';
import type { ResetPasswordFormSchema } from '@/src/schemas/auth/ResetPasswordFormSchema';
import { resetPasswordFormSchema } from '@/src/schemas/auth/ResetPasswordFormSchema';
import { useResetPasswordMutation } from '@/src/api/auth.api';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { styles } from '@/src/constants/styles.constant';

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormSchema>({
    mode: 'all',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resetPasswordFormSchema),
  });

  const { trigger, isMutating } = useResetPasswordMutation({
    onSuccess() {
      toast.success('Reset password successfully');
      setTimeout(() => router.push('/login'), 1500);
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  const handleResetPassword = form.handleSubmit(
    (data: ResetPasswordFormSchema) => {
      trigger({
        token: token,
        resetPasswordRequest: {
          newPassword: data?.newPassword,
          confirmPassword: data?.confirmPassword,
        },
      });
    },
  );

  return (
    <Form {...form}>
      <form
        onSubmit={(data) => {
          if (form.formState.isValid) {
            handleResetPassword(data);
          }
        }}
        className={clsx('flex items-center justify-center flex-col')}
      >
        <div className='w-full mt-5 relative mb-1'>
          <FormInput
            id='newPassword'
            name='newPassword'
            label='newPassword'
            required
            type={!showPassword ? 'password' : 'text'}
            rightIcon={
              !showPassword ? (
                <AiOutlineEyeInvisible
                  className='text-primary'
                  size={20}
                  onClick={() => setShowPassword(true)}
                />
              ) : (
                <AiOutlineEye
                  className='text-primary'
                  size={20}
                  onClick={() => setShowPassword(false)}
                />
              )
            }
            placeholder='password!@%'
            control={form.control}
            showError={true}
          />
        </div>

        <div className='w-full mt-5 relative mb-1'>
          <FormInput
            id='confirm-password'
            name='confirmPassword'
            label='confirmPassword'
            required
            type={!showConfirmPassword ? 'password' : 'text'}
            rightIcon={
              !showConfirmPassword ? (
                <AiOutlineEyeInvisible
                  className='text-primary'
                  size={20}
                  onClick={() => setShowConfirmPassword(true)}
                />
              ) : (
                <AiOutlineEye
                  className='text-primary'
                  size={20}
                  onClick={() => setShowConfirmPassword(false)}
                />
              )
            }
            placeholder='password!@%'
            control={form.control}
            showError={true}
          />
        </div>

        <Button
          title='Update password'
          type='submit'
          className='w-full mt-5'
          disabled={!form.formState.isValid}
          isLoading={isMutating}
        />
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
          href='/forgot-password'
        >
          <FaArrowLeft
            size={16}
            className='group-hover:-translate-x-2 transition-all'
          />
          <span>Back to forgot password</span>
        </Link>
      </form>
    </Form>
  );
}
