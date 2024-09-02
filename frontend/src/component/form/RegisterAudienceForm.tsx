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
import { Label } from '../common/Label';
import { styles } from '@/src/constant/styles.constant';
import Button from '../common/Button/Button';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import SuccessRegistration from '@/src/view/audience/SuccessRegistration';
import type { RegisterAudienceFormSchema } from '@/src/schemas/audience/RegisterAudienceFormSchema';
import { registerAudienceFormSchema } from '@/src/schemas/audience/RegisterAudienceFormSchema';
import { useRegisterAudienceMutation } from '@/src/api/user.api';

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
          <SuccessRegistration
            email={data.email}
            expireAt={data.expireAt}
          />
        ) : (
          <>
            <div className='w-full'>
              <div className='w-full'>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='email'
                    className={clsx(styles.label)}
                  >
                    Your email
                  </Label>
                </div>
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
                  placeholder='registermail@gmail.com'
                  control={form.control}
                  isDisplayError={true}
                  className={clsx(
                    form.formState.errors.email &&
                      form.formState.touchedFields.email &&
                      'border-error-main',
                  )}
                />
              </div>

              <div className='flex w-full mt-5 mb-1 items-start justify-between gap-2'>
                <div className='w-full'>
                  <div className='mb-2 block'>
                    <Label
                      htmlFor='firstName'
                      className={clsx(styles.label)}
                    >
                      First name
                    </Label>
                  </div>
                  <FormInput
                    id='firstName'
                    name='firstName'
                    placeholder='Kevin'
                    className={clsx(
                      form.formState.errors.firstName &&
                        form.formState.touchedFields.firstName &&
                        'border-error-main',
                    )}
                    control={form.control}
                    isDisplayError={true}
                  />
                </div>

                <div className='w-full'>
                  <div className='mb-2 block'>
                    <Label
                      htmlFor='lastName'
                      className={clsx(styles.label)}
                    >
                      Last name
                    </Label>
                  </div>
                  <FormInput
                    id='lastName'
                    name='lastName'
                    placeholder='De Bruyne'
                    className={clsx(
                      form.formState.errors.lastName &&
                        form.formState.touchedFields.lastName &&
                        'border-error-main',
                    )}
                    control={form.control}
                    isDisplayError={true}
                  />
                </div>
              </div>
              <div className='w-full mt-5 relative mb-1'>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='password'
                    className={clsx(styles.label)}
                  >
                    Enter your password
                  </Label>
                </div>
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

              <div className='w-full mt-5 relative mb-1'>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='confirm-password'
                    className={clsx(styles.label)}
                  >
                    Confirm password
                  </Label>
                </div>
                <FormInput
                  id='confirm-password'
                  name='confirmPassword'
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
                  className={clsx(
                    form.formState.errors.confirmPassword &&
                      form.formState.touchedFields.confirmPassword &&
                      'border-error-main',
                  )}
                  control={form.control}
                  isDisplayError={true}
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
              </Link>{' '}
              and{' '}
              <Link
                href='#'
                underline='hover'
                className='text-primary mx-1'
              >
                Personal Information Handling
              </Link>{' '}
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
              <Button className='outline-none'>
                Navigate to organization{' '}
              </Button>
            </p>
          </>
        )}
      </form>
    </Form>
  );
}

export default RegisterAudienceForm;
