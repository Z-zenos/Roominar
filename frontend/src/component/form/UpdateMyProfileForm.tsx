'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import {
  Form,
  FormCombobox,
  FormCustomLabel,
  FormImageUploader,
  FormInput,
  FormTagsInput,
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
import { styles } from '@/src/constant/styles.constant';
import { useListingTagsQuery } from '@/src/api/tag.api';

export default function UpdateMyProfileForm() {
  useState<boolean>(false);
  const { data: auth, status } = useSession();
  const { width } = useWindowDimensions();
  const { data: tagData } = useListingTagsQuery();

  const form = useForm<UpdateMyProfileFormSchema>({
    mode: 'all',
    defaultValues: {
      firstName: auth?.user?.firstName || '',
      lastName: auth?.user?.lastName || '',
      workplaceName: auth?.user?.workplaceName || '',
      phoneNumber: auth?.user?.phone || '',
      industryCode: (auth?.user?.industryCode as IndustryCode) || undefined,
      jobTypeCode: (auth?.user?.jobTypeCode as JobTypeCode) || undefined,
      tags: auth?.user?.tags.map((tag) => tag.id) || undefined,
    },
    resolver: zodResolver(updateMyProfileFormSchema),
  });

  const { trigger, isMutating: isUpdating } = useUpdateMyProfileMutation({
    onSuccess() {
      toast.success('Update profile successfully!');
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
    trigger({
      updateUserRequest: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        // avatarUrl: data.avatarUrl,
        workplaceName: data.workplaceName,
        phone: data.phoneNumber,
        industryCode: data.industryCode,
        jobTypeCode: data.jobTypeCode,
      },
    });

    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateMyProfile)}
        className='lg:w-[800px] w-full mx-auto'
      >
        <div
          className={clsx(styles.between, 'py-5 border-b border-b-slate-300')}
        >
          <div>
            <h3 className='text-xm font-semibold mb-1'>Profile</h3>
            <p className='opacity-50 font-light text-sm'>
              View and update your profile details
            </p>
          </div>
          <Button
            title='Save changes'
            type='submit'
            className='w-40'
            disabled={!form.formState.isValid}
            isLoading={isUpdating}
          />
        </div>
        <div className='w-full mt-10'>
          <div
            className={clsx(
              'grid gap-8 items-center',
              width < 1000 ? 'grid-cols-1' : 'grid-cols-2',
            )}
          >
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
                htmlFor='avatarUrl'
                title='Avatar'
              />
              <FormImageUploader
                control={form.control}
                name='avatarUrl'
              />
            </div>
            &nbsp;
            <div className='self-start'>
              <FormCustomLabel
                htmlFor='jobTypeCode'
                title='Job type'
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
            <div className='col-span-2'>
              <FormCustomLabel
                htmlFor='tags'
                title='Tags'
              />
              <FormTagsInput
                title='tags'
                name='tags'
                control={form.control}
                data={tagData}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
