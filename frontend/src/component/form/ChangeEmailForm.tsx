'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Form, FormCustomLabel, FormInput } from '@/src/component/form/Form';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import useWindowDimensions from '@/src/hook/useWindowDimension';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type { ChangeEmailFormSchema } from '@/src/schemas/auth/ChangeEmailFormSchema';
import { changeEmailFormSchema } from '@/src/schemas/auth/ChangeEmailFormSchema';
import { useRequestChangeEmailMutation } from '@/src/api/auth.api';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Button } from '@nextui-org/button';
import { styles } from '@/src/constant/styles.constant';
import { maskEmail } from '@/src/util/app.util';

export default function ChangeEmailForm() {
  useState<boolean>(false);
  const { data: auth, status } = useSession();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const form = useForm<ChangeEmailFormSchema>({
    mode: 'all',
    defaultValues: {
      newEmail: '',
      password: '',
    },
    resolver: zodResolver(changeEmailFormSchema),
  });

  const { trigger, isMutating: isRequesting } = useRequestChangeEmailMutation({
    onSuccess() {
      toast.success('A verify link sent to your new email!');
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

  function handleChangeEmail(data: ChangeEmailFormSchema) {
    trigger({
      changeEmailRequest: {
        newEmail: data.newEmail,
        password: data.password,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleChangeEmail)}>
        <div className={clsx(styles.between, 'gap-4 !items-end mt-8')}>
          <div className='self-start'>
            <FormCustomLabel
              htmlFor='email'
              className='font-medium text-nm'
            />
            <p className=''>{maskEmail(auth?.user?.email)}</p>
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
            {showForm ? 'Close' : 'Change Email'}
          </Button>
        </div>
        <p className='opacity-60 font-light text-sm mt-3'>
          (＊) Enter your new email address and confirm the change via the link
          sent to your inbox.
        </p>
        {showForm && (
          <div className='w-full mt-4 bg-emerald-50 p-5 rounded-md animate-appearance-in'>
            <div
              className={clsx(
                'grid gap-8 items-start',
                width < 1000 ? 'grid-cols-1' : 'grid-cols-2',
              )}
            >
              <div className='self-start'>
                <FormCustomLabel
                  htmlFor='newEmail'
                  required
                />
                <FormInput
                  id='newEmail'
                  name='newEmail'
                  placeholder='newemail@gmail.com'
                  className={clsx(
                    form.formState.errors.newEmail &&
                      form.formState.touchedFields.newEmail &&
                      'border-error-main',
                    status === 'authenticated' && 'bg-slate-100 text-gray-500',
                  )}
                  type='email'
                  control={form.control}
                  isDisplayError={
                    form.formState.errors.newEmail &&
                    form.formState.touchedFields.newEmail &&
                    true
                  }
                />
              </div>

              <div className='w-full relative mb-1'>
                <FormCustomLabel
                  htmlFor='password'
                  required
                />
                <FormInput
                  id='password'
                  name='password'
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
                  className={clsx(
                    form.formState.errors.password &&
                      form.formState.touchedFields.password &&
                      'border-error-main',
                  )}
                  control={form.control}
                  isDisplayError={
                    form.formState.errors.password &&
                    form.formState.touchedFields.password &&
                    true
                  }
                />
              </div>
            </div>

            <div className='flex justify-end mt-4 gap-3'>
              <Button
                type='submit'
                color='primary'
                radius='sm'
                isLoading={isRequesting}
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
