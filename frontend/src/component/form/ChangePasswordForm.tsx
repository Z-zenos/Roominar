'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Form, FormCustomLabel, FormInput } from '@/src/component/form/Form';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import { useState } from 'react';
import useWindowDimensions from '@/src/hook/useWindowDimension';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Button } from '@nextui-org/button';
import { styles } from '@/src/constant/styles.constant';
import type { ChangePasswordFormSchema } from '@/src/schemas/auth/ChangePasswordFormSchema';
import { changePasswordFormSchema } from '@/src/schemas/auth/ChangePasswordFormSchema';
import { useChangePasswordMutation } from '@/src/api/auth.api';
import { Link } from '@nextui-org/link';

export default function ChangePasswordForm() {
  useState<boolean>(false);
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const form = useForm<ChangePasswordFormSchema>({
    mode: 'all',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    resolver: zodResolver(changePasswordFormSchema),
  });

  const { trigger, isMutating: isChanging } = useChangePasswordMutation({
    onSuccess() {
      toast.success('Update password successfully!');
      form.reset();
      router.refresh();
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  function handleChangePassword(data: ChangePasswordFormSchema) {
    trigger({
      changePasswordRequest: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleChangePassword)}>
        <div
          className={clsx(
            styles.flexStart,
            'gap-4 !items-end mt-8 pt-6 border-t border-t-gray-300',
          )}
        >
          <div className='self-start min-w-[300px] mr-[6px]'>
            <h3 className='font-semibold'>Password</h3>
            <p className='opacity-60 font-light text-sm'>
              Last updated 9 month(s) ago.
            </p>
          </div>

          <Button
            type='button'
            color='primary'
            className='mb-1'
            onClick={() => {
              setShowForm(!showForm);
            }}
            radius='sm'
          >
            {showForm ? 'Close' : 'Update'}
          </Button>
        </div>
        {showForm && (
          <div className='w-full mt-4 bg-emerald-50 p-5 rounded-md animate-appearance-in'>
            <div
              className={clsx(
                'grid gap-8 items-start',
                width < 1000 ? 'grid-cols-1' : 'grid-cols-2',
              )}
            >
              <div className='w-full relative mb-1'>
                <FormCustomLabel
                  htmlFor='currentPassword'
                  title='Current Password'
                  required
                />
                <FormInput
                  id='currentPassword'
                  name='currentPassword'
                  type={!showCurrentPassword ? 'password' : 'text'}
                  rightIcon={
                    !showCurrentPassword ? (
                      <AiOutlineEyeInvisible
                        className='text-primary'
                        size={20}
                        onClick={() => setShowCurrentPassword(true)}
                      />
                    ) : (
                      <AiOutlineEye
                        className='text-primary'
                        size={20}
                        onClick={() => setShowCurrentPassword(false)}
                      />
                    )
                  }
                  placeholder='password!@%'
                  className={clsx(
                    form.formState.errors.currentPassword &&
                      form.formState.touchedFields.currentPassword &&
                      'border-error-main',
                  )}
                  control={form.control}
                  isDisplayError={
                    form.formState.errors.currentPassword &&
                    form.formState.touchedFields.currentPassword &&
                    true
                  }
                />
              </div>
              <Link
                href='/forgot-password'
                className='self-center text-primary'
                underline='hover'
              >
                Forgot password ?
              </Link>
              <div className='w-full relative mb-1 self-start'>
                <FormCustomLabel
                  htmlFor='newPassword'
                  title='New Password'
                  required
                />
                <FormInput
                  id='newPassword'
                  name='newPassword'
                  type={!showNewPassword ? 'password' : 'text'}
                  rightIcon={
                    !showNewPassword ? (
                      <AiOutlineEyeInvisible
                        className='text-primary'
                        size={20}
                        onClick={() => setShowNewPassword(true)}
                      />
                    ) : (
                      <AiOutlineEye
                        className='text-primary'
                        size={20}
                        onClick={() => setShowNewPassword(false)}
                      />
                    )
                  }
                  placeholder='password!@%'
                  className={clsx(
                    form.formState.errors.newPassword &&
                      form.formState.touchedFields.newPassword &&
                      'border-error-main',
                  )}
                  control={form.control}
                  isDisplayError={
                    form.formState.errors.newPassword &&
                    form.formState.touchedFields.newPassword &&
                    true
                  }
                />
              </div>
              <div className='w-full relative mb-1'>
                <FormCustomLabel
                  htmlFor='confirmNewPassword'
                  title='Confirm Password'
                  required
                />
                <FormInput
                  id='confirmNewPassword'
                  name='confirmNewPassword'
                  type={!showConfirmNewPassword ? 'password' : 'text'}
                  rightIcon={
                    !showConfirmNewPassword ? (
                      <AiOutlineEyeInvisible
                        className='text-primary'
                        size={20}
                        onClick={() => setShowConfirmNewPassword(true)}
                      />
                    ) : (
                      <AiOutlineEye
                        className='text-primary'
                        size={20}
                        onClick={() => setShowConfirmNewPassword(false)}
                      />
                    )
                  }
                  placeholder='password!@%'
                  className={clsx(
                    form.formState.errors.confirmNewPassword &&
                      form.formState.touchedFields.confirmNewPassword &&
                      'border-error-main',
                  )}
                  control={form.control}
                  isDisplayError={
                    form.formState.errors.confirmNewPassword &&
                    form.formState.touchedFields.confirmNewPassword &&
                    true
                  }
                />
              </div>
            </div>

            <div className='flex justify-between mt-4 gap-3'>
              <p className='opacity-60 font-light text-sm w-[400px]'>
                (＊) Enter your current password followed by your new password
                to securely update your credentials.
              </p>
              <Button
                type='submit'
                color='primary'
                radius='sm'
                isLoading={isChanging}
                isDisabled={!form.formState.isValid}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
