'use client';

import { useState } from 'react';
import type { Message } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillFacebook } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiMail } from 'react-icons/hi';
import clsx from 'clsx';
import { Link } from '@nextui-org/link';
import { audLoginFormSchema, type AudLoginFormSchema } from '@/src/schemas/audience/AudLoginFormSchema';
import { Form, FormCheckBox, FormInput } from './Form';
import { Label } from '../common/Label';
import { styles } from '@/src/constant/styles.constant';
import Button from '../common/Button/Button';

export default function AudLoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AudLoginFormSchema>({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(audLoginFormSchema),
  });

  //   useEffect(() => {
  //     if (isSuccess) {
  //       const message = data?.message || 'Login successful';

  //       toast.success(message, { duration: 3000 });
  //       form.reset();
  //       setTimeout(() => window.location.reload(), 1000);
  //     }
  //     if (error) {
  //       if ('data' in error) {
  //         const errorData = error as any;

  //         toast.error(errorData.data.message);
  //       }
  //     }
  //   }, [isSuccess, error]);

  async function handleLoginUser(data: AudLoginFormSchema) {
    if (Object.keys(form.formState.errors).length === 0 && form.formState.errors.constructor === Object) {
      try {
        console.log(data);
        // await loginUser(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error?.response?.data?.message as Message);
      }
    } else {
      toast.error(form.formState.errors?.email?.message as Message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLoginUser)} className={clsx('flex items-center justify-center flex-col')}>
        <div className='w-full'>
          <div className='mb-2 block'>
            <Label htmlFor='email' className={clsx(styles.label)}>
              Your email
            </Label>
          </div>
          <FormInput
            id='email'
            name='email'
            type='email'
            rightIcon={<HiMail size={20} className='text-primary' />}
            placeholder='loginmail@gmail.com'
            className={clsx(form.formState.errors.email && form.formState.touchedFields.email && 'border-error-main')}
            control={form.control}
            isDisplayError={true}
          />
        </div>

        <div className='w-full mt-5 relative mb-1'>
          <div className='mb-2 block'>
            <Label htmlFor='password' className={clsx(styles.label)}>
              Enter your password
            </Label>
          </div>
          <FormInput
            id='password'
            name='password'
            type={!showPassword ? 'password' : 'text'}
            rightIcon={
              !showPassword ? (
                <AiOutlineEyeInvisible className='text-primary' size={20} onClick={() => setShowPassword(true)} />
              ) : (
                <AiOutlineEye className='text-primary' size={20} onClick={() => setShowPassword(false)} />
              )
            }
            placeholder='password!@%'
            className={clsx(
              form.formState.errors.password && form.formState.touchedFields.password && 'border-error-main',
            )}
            control={form.control}
            isDisplayError={true}
          />
        </div>
        <div className='w-full mt-5 relative mb-1 flex justify-between items-center'>
          <FormCheckBox id='remember-me' title='Remember me' name='rememberMe' control={form.control} />
          <Link href='#' className='text-primary' underline='hover'>
            Forgot password ?
          </Link>
        </div>
        <Button
          title='Login'
          type='submit'
          className='w-full mt-5'
          disabled={!form.formState.isValid || !form.formState.isDirty}
        />
        <br />
        <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>Or join with</h5>
        <div className='flex items-center justify-center mt-3'>
          <FcGoogle size={30} className='cursor-pointer mr-2' onClick={() => signIn('google')} />
          <AiFillFacebook size={30} className='cursor-pointer ml-2 text-[#1877F2]' onClick={() => signIn('facebook')} />
        </div>
        <h5 className='text-center pt-4 font-Poppins text-nm font-light'>
          Not have any account?
          <Link href='/register' className='text-primary font-semibold pl-1 cursor-pointer'>
            Sign up
          </Link>
        </h5>

        <p className={clsx('mt-4 gap-2 font-light', styles.center)}>
          Want to host your own event?
          <Button className='outline-none'>Navigate to organization </Button>
        </p>
      </form>
    </Form>
  );
}
