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
import { Form, FormCheckBox, FormInput } from './Form';
import Button from '../common/Button/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCookie, setCookie } from 'cookies-next';
import { toCamelCase } from '@/src/utils/app.util';
import { initialScreen } from '@/src/constants/app.constant';
import type { LoginFormSchema } from '@/src/schemas/auth/LoginFormSchema';
import { loginFormSchema } from '@/src/schemas/auth/LoginFormSchema';

interface LoginFormProps {
  roleCode: 'AUDIENCE' | 'ORGANIZER';
}

export default function LoginForm({ roleCode }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const form = useForm<LoginFormSchema>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(loginFormSchema),
  });

  useEffect(() => {
    form.setValue('rememberMe', getCookie('rememberMe') === 'true');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = form.handleSubmit(async (data: LoginFormSchema) => {
    if (!isLoading) {
      setIsLoading(true);

      setCookie('rememberMe', data.rememberMe?.toString());

      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        redirect: false,
        roleCode: roleCode,
      });

      if (res.status === 200) {
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
      if (res.status == 401) {
        setIsLoading(false);
        return toast.error('Invalid email or password.');
      }
      if (res.status == 404) {
        setIsLoading(false);
        return toast.error('Invalid email or password.');
      }
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleLogin}
        className={clsx('flex items-center justify-center flex-col')}
      >
        <div className='w-full'>
          <FormInput
            id='email'
            name='email'
            type='email'
            required
            label='email'
            rightIcon={
              <HiMail
                size={20}
                className='text-primary'
              />
            }
            placeholder='login@gmail.com'
            control={form.control}
            showError={true}
          />
        </div>

        <div className='w-full mt-5 relative mb-1'>
          <FormInput
            id='password'
            name='password'
            control={form.control}
            required
            label='password'
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
            showError={true}
          />
        </div>
        <div className='w-full mt-5 relative mb-1 flex justify-between items-center'>
          <FormCheckBox
            id='rememberMe'
            label='rememberMe'
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
          disabled={!form.formState.isValid}
          isLoading={isLoading}
        />
        <br />
      </form>
    </Form>
  );
}
