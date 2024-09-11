'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import {
  Form,
  FormCombobox,
  FormCustomLabel,
  FormInput,
} from '@/src/component/form/Form';
import Button from '@/src/component/common/Button/Button';
import { parseCode } from '@/src/util/app.util';
import type {
  ApiException,
  ErrorResponse400,
  JobTypeCode,
} from '@/src/lib/api/generated';
import { IndustryCode } from '@/src/lib/api/generated';
import { JobTypeCodeMapping } from '@/src/constant/code.constant';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiSolidSchool } from 'react-icons/bi';
import { FaPhone } from 'react-icons/fa6';
import useWindowDimensions from '@/src/hook/useWindowDimension';
import type { UpdateMyProfileFormSchema } from '@/src/schemas/audience/UpdateMyProfileFormSchema';
import updateMyProfileFormSchema from '@/src/schemas/audience/UpdateMyProfileFormSchema';
import { useUpdateMyProfileMutation } from '@/src/api/user.api';
import toast from 'react-hot-toast';

export default function UpdateMyProfileForm() {
  useState<boolean>(false);
  const { data: auth, status } = useSession();
  const { width } = useWindowDimensions();

  const form = useForm<UpdateMyProfileFormSchema>({
    mode: 'all',
    defaultValues: {
      firstName: auth?.user?.firstName || '',
      lastName: auth?.user?.lastName || '',
      workplaceName: auth?.user?.workplaceName || '',
      phoneNumber: auth?.user?.phone || '',
      industryCode: (auth?.user?.industryCode as IndustryCode) || undefined,
      jobTypeCode: (auth?.user?.jobTypeCode as JobTypeCode) || undefined,
    },
    resolver: zodResolver(updateMyProfileFormSchema),
  });

  const { trigger, isMutating: isUpdating } = useUpdateMyProfileMutation({
    onSuccess() {
      toast.success('Apply event successfully!');
      form.reset();
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  function handleUpdateMyProfile(data: UpdateMyProfileFormSchema) {
    // trigger({
    //   eventId: event.id,
    //   createApplicationRequest: {
    //     email: data.email,
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     workplaceName: data.workplaceName,
    //     phone: data.phoneNumber,
    //     industryCode: data.industryCode,
    //     jobTypeCode: data.jobTypeCode,
    //     questionAnswerResults:
    //       data.questionAnswerResults as QuestionAnswerResultItem[],
    //     ticketId: +data.ticketId,
    //     isAgreed: data.isAgreed,
    //   },
    // });

    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateMyProfile)}
        className={clsx('mx-auto')}
      >
        <div className='w-full'>
          <div
            className={clsx(
              'grid gap-8 items-center',
              width < 1000 ? 'grid-cols-1' : 'grid-cols-2',
            )}
          >
            {/* <div>
                <FormCustomLabel
                  htmlFor='email'
                  title='Your email'
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
                  placeholder='registermail@gmail.com'
                  control={form.control}
                  isDisplayError={true}
                  className={clsx(
                    form.formState.errors.email &&
                      form.formState.touchedFields.email &&
                      'border-error-main',
                    status === 'authenticated' && 'bg-slate-100 text-gray-500',
                  )}

                />
              </div> */}
            {width < 600 ? <></> : <>&nbsp;</>}
            <div className='self-start'>
              <FormCustomLabel
                htmlFor='firstName'
                title='First name'
                required
              />
              <FormInput
                id='firstName'
                name='firstName'
                placeholder='Kevin'
                className={clsx(
                  form.formState.errors.firstName &&
                    form.formState.touchedFields.firstName &&
                    'border-error-main',
                  status === 'authenticated' && 'bg-slate-100 text-gray-500',
                )}
                control={form.control}
                isDisplayError={true}
              />
            </div>
            <div className='self-start'>
              <FormCustomLabel
                htmlFor='lastName'
                title='Last name'
                required
              />
              <FormInput
                id='lastName'
                name='lastName'
                placeholder='De Bruyne'
                className={clsx(
                  form.formState.errors.lastName &&
                    form.formState.touchedFields.lastName &&
                    'border-error-main',
                  status === 'authenticated' && 'bg-slate-100 text-gray-500',
                )}
                control={form.control}
                isDisplayError={true}
              />
            </div>
            <div className='self-start'>
              <FormCustomLabel
                htmlFor='workplaceName'
                title='Workplace name'
                required
              />
              <FormInput
                id='workplaceName'
                name='workplaceName'
                placeholder='Place you work or learn'
                className={clsx(
                  form.formState.errors.firstName &&
                    form.formState.touchedFields.firstName &&
                    'border-error-main',
                  status === 'authenticated' && 'bg-slate-100 text-gray-500',
                )}
                control={form.control}
                isDisplayError={true}
                rightIcon={
                  <BiSolidSchool
                    className='text-primary'
                    size={20}
                  />
                }
              />
            </div>
            <div className='self-start'>
              <FormCustomLabel
                htmlFor='phoneNumber'
                title='Phone number'
                required
              />
              <FormInput
                id='phoneNumber'
                name='phoneNumber'
                placeholder='Kevin'
                className={clsx(
                  form.formState.errors.firstName &&
                    form.formState.touchedFields.firstName &&
                    'border-error-main',
                  status === 'authenticated' && 'bg-slate-100 text-gray-500',
                )}
                control={form.control}
                isDisplayError={true}
                rightIcon={
                  <FaPhone
                    className='text-primary'
                    size={20}
                  />
                }
              />
            </div>
            <div className='self-start'>
              <FormCustomLabel
                htmlFor='jobTypeCode'
                title='Job type'
                required
              />
              <FormCombobox
                data={Object.keys(JobTypeCodeMapping).map((key: string) => ({
                  value: key,
                  label: JobTypeCodeMapping[key],
                }))}
                name='jobTypeCode'
                control={form.control}
                title='type job'
                multiple={false}
                className={clsx(
                  'w-full',
                  status === 'authenticated' &&
                    'bg-slate-100 text-gray-500 pointer-events-none',
                )}
              />
            </div>
            <div className='self-start'>
              <FormCustomLabel
                htmlFor='industryCode'
                title='Industry'
                required
              />
              <FormCombobox
                data={Object.keys(IndustryCode).map((ic: string) => ({
                  value: IndustryCode[ic],
                  label: parseCode(IndustryCode[ic]),
                }))}
                name='industryCode'
                control={form.control}
                title='industry'
                multiple={false}
                className={clsx(
                  'w-full',
                  status === 'authenticated' &&
                    'bg-slate-100 text-gray-500 pointer-events-none',
                )}
              />
            </div>
          </div>
        </div>

        <Button
          title='Update'
          type='submit'
          className='w-80 mt-5 mx-auto'
          disabled={!form.formState.isValid}
          isLoading={isUpdating}
        />
      </form>
    </Form>
  );
}
