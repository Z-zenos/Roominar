'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Form, FormInput } from '@/src/component/form/Form';

import { useState } from 'react';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Button } from '@nextui-org/button';
import { styles } from '@/src/constants/styles.constant';
import type { ChangePasswordFormSchema } from '@/src/schemas/auth/ChangePasswordFormSchema';
import { changePasswordFormSchema } from '@/src/schemas/auth/ChangePasswordFormSchema';
import { useChangePasswordMutation } from '@/src/api/auth.api';
import { Link } from '@nextui-org/link';
import { handleApiError } from '@/src/utils/app.util';

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
      toast.success('Đổi mật khẩu thành công! 🎉');
      form.reset();
      router.refresh();
    },
    onError: handleApiError,
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
      <form
        onSubmit={form.handleSubmit(handleChangePassword)}
        className='w-full'
      >
        <div
          className={clsx(
            styles.between,
            'gap-4 !items-end mt-8 pt-6 border-t border-t-gray-300',
          )}
        >
          <div className='self-start 450px:min-w-[300px] mr-[6px]'>
            <h3 className='font-semibold'>Mật khẩu</h3>
            <p className='opacity-60 font-light text-sm'>
              Cập nhật 9 tháng trước.
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
            {showForm ? 'Đóng' : 'Cập nhật mật khẩu'}
          </Button>
        </div>
        {showForm && (
          <div className='w-full mt-4 bg-emerald-50 p-5 rounded-md animate-appearance-in'>
            <div
              className={clsx(
                'grid 450px:gap-8 gap-4 items-start w-full',
                width < 1000 ? 'grid-cols-1' : 'grid-cols-2',
              )}
            >
              <div className='w-full relative mb-1'>
                <FormInput
                  id='currentPassword'
                  name='currentPassword'
                  label='currentPassword'
                  required
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
                  control={form.control}
                  showError={
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
                Quên mật khẩu ?
              </Link>
              <div className='w-full relative mb-1 self-start'>
                <FormInput
                  id='newPassword'
                  name='newPassword'
                  label='newPassword'
                  required
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
                  control={form.control}
                  showError={
                    form.formState.errors.newPassword &&
                    form.formState.touchedFields.newPassword &&
                    true
                  }
                />
              </div>
              <div className='w-full relative mb-1'>
                <FormInput
                  id='confirmNewPassword'
                  name='confirmNewPassword'
                  label='confirmNewPassword'
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
                  control={form.control}
                  showError={
                    form.formState.errors.confirmNewPassword &&
                    form.formState.touchedFields.confirmNewPassword &&
                    true
                  }
                />
              </div>
            </div>

            <div className='flex justify-between mt-4 gap-3'>
              <ul className='list-disc pl-2'>
                <li className='opacity-60 font-light text-sm 450px:w-[400px] w-fit'>
                  Mật khẩu phải chứa ít nhất 1 chữ cái, 1 số và 1 ký tự đặc
                  biệt.
                </li>
                <li className='opacity-60 font-light text-sm 450px:w-[400px]'>
                  Độ dài tối thiểu là 8 ký tự.
                </li>
              </ul>
              <Button
                type='submit'
                color='primary'
                radius='sm'
                isLoading={isChanging}
                isDisabled={!form.formState.isValid}
              >
                Gửi
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
