'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiFillFacebook,
} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiMail } from 'react-icons/hi';
import clsx from 'clsx';
import { Form, FormInput } from './Form';
import { Link } from '@nextui-org/link';
import { styles } from '@/src/constants/styles.constant';
import Button from '../common/Button/Button';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import RegisterAudienceSuccess from '@/src/view/audience/RegisterAudienceSuccess';
import type { RegisterAudienceFormSchema } from '@/src/schemas/auth/RegisterAudienceFormSchema';
import { registerAudienceFormSchema } from '@/src/schemas/auth/RegisterAudienceFormSchema';
import { useRegisterAudienceMutation } from '@/src/api/auth.api';

function RegisterAudienceForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterAudienceFormSchema>({
    mode: 'all',
    defaultValues: {
      avatar: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(registerAudienceFormSchema),
  });

  const {
    trigger,
    data,
    isMutating: isLoading,
  } = useRegisterAudienceMutation({
    onSuccess() {
      toast.success('Successfully Account Registration!');
      setIsRegisterSuccess(true);
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false);
  const handleRegister = (value: RegisterAudienceFormSchema) => {
    trigger({
      registerAudienceRequest: {
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
        password: value.password,
        confirmPassword: value.confirmPassword,
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className={clsx('flex items-center justify-center flex-col')}
      >
        {isRegisterSuccess ? (
          <RegisterAudienceSuccess
            email={data.email}
            expireAt={data.expireAt}
          />
        ) : (
          <>
            <div className='w-full'>
              <FormInput
                id='email'
                name='email'
                type='email'
                label='email'
                required
                rightIcon={
                  <HiMail
                    size={20}
                    className='text-primary'
                  />
                }
                placeholder='registermail@gmail.com'
                control={form.control}
                showError={true}
              />

              <div className='flex w-full mt-5 mb-1 items-start justify-between gap-2'>
                <div className='w-full'>
                  <FormInput
                    id='firstName'
                    name='firstName'
                    label='firstName'
                    required
                    placeholder='Kevin'
                    control={form.control}
                    showError={true}
                    className='w-full'
                  />
                </div>

                <div className='w-full'>
                  <FormInput
                    id='lastName'
                    name='lastName'
                    label='lastName'
                    required
                    placeholder='De Bruyne'
                    control={form.control}
                    showError={true}
                  />
                </div>
              </div>
              <div className='w-full mt-5 relative mb-1'>
                <FormInput
                  id='password'
                  name='password'
                  label='password'
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
                  id='confirmPassword'
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
            </div>
            <p className='text-sm text-gray-600 font-light mt-3'>
              Please agree to the
              <Link
                href='#'
                underline='hover'
                className='text-primary mx-1'
              >
                Terms of Use
              </Link>
              and
              <Link
                href='#'
                underline='hover'
                className='text-primary mx-1'
              >
                Personal Information Handling
              </Link>
              before registering.
            </p>
            <Button
              title='Register'
              type='submit'
              className='w-80 mt-5'
              disabled={!form.formState.isValid}
              isLoading={isLoading}
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
              Already have account?
              <Link
                href='/login'
                className='text-primary font-semibold pl-1 cursor-pointer'
              >
                Login
              </Link>
            </h5>

            <p className={clsx('mt-4 gap-2 font-light', styles.center)}>
              Want to host your own event?
              <Button className='outline-none'>Navigate to organization</Button>
            </p>
          </>
        )}
      </form>
    </Form>
  );
}

export default RegisterAudienceForm;
