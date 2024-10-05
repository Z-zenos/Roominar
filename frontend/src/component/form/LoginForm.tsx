'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { getSession, signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiMail } from 'react-icons/hi';
import clsx from 'clsx';
import { Link } from '@nextui-org/link';
import { Form, FormCheckBox, FormCustomLabel, FormInput } from './Form';
import Button from '../common/Button/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';
import { toCamelCase } from '@/src/util/app.util';
import { initialScreen } from '@/src/constant/app.constant';
import type { LoginFormSchema } from '@/src/schemas/auth/LoginFormSchema';
import { loginFormSchema } from '@/src/schemas/auth/LoginFormSchema';

interface LoginFormProps {
  roleCode: 'AUDIENCE' | 'ORGANIZER';
}

export default function LoginForm({ roleCode }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<LoginFormSchema>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    resolver: zodResolver(loginFormSchema),
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    form.setValue('rememberMe', getCookie('rememberMe') === 'true');
  }, [form]);

  const handleLogin = form.handleSubmit((data: LoginFormSchema) => {
    if (!isLoading) {
      setIsLoading(true);

      setCookie('rememberMe', data.rememberMe?.toString());

      signIn('credentials', {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        redirect: false,
        roleCode: roleCode,
      }).then(async (value) => {
        if (value.status == 200) {
          const session = await getSession();
          setIsLoading(false);
          if (searchParams.has('callback')) {
            router.back();
          } else {
            router.push(initialScreen?.[toCamelCase(session.user).roleCode]);
            router.refresh();
          }
          return;
        }
        if (value.status == 401) {
          setIsLoading(false);
          return toast.error('Invalid email or password.');
        }
        if (value.status == 404) {
          setIsLoading(false);
          return toast.error('Invalid email or password.');
        }
      });
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(data) => {
          if (form.formState.isValid) {
            setIsLoading(true);
            handleLogin(data);
          }
        }}
        className={clsx('flex items-center justify-center flex-col')}
      >
        <div className='w-full'>
          <FormCustomLabel
            htmlFor='email'
            required
          />
          <FormInput
            id='email'
            name='email'
            type='email'
            rightIcon={
              <HiMail
                size={20}
                className='text-primary'
              />
            }
            placeholder='loginmail@gmail.com'
            className={clsx(
              form.formState.errors.email &&
                form.formState.touchedFields.email &&
                'border-error-main',
            )}
            control={form.control}
            isDisplayError={true}
          />
        </div>

        <div className='w-full mt-5 relative mb-1'>
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
            isDisplayError={true}
          />
        </div>
        <div className='w-full mt-5 relative mb-1 flex justify-between items-center'>
          <FormCheckBox
            id='remember-me'
            title='Remember me'
            name='rememberMe'
            control={form.control}
          />
          <Link
            href='/forgot-password'
            className='text-primary'
            underline='hover'
          >
            Forgot password ?
          </Link>
        </div>
        <Button
          title='Login'
          type='submit'
          className='w-full mt-5'
          disabled={!form.formState.isValid || !form.formState.isDirty}
          isLoading={isLoading}
        />
        <br />
      </form>
    </Form>
  );
}
