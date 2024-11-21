'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import {
  Form,
  FormCombobox,
  FormCustomLabel,
  FormInput,
  FormTagsInput,
} from '@/src/component/form/Form';
import { optionify } from '@/src/util/app.util';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import { JobTypeCode } from '@/src/lib/api/generated';
import { IndustryCode } from '@/src/lib/api/generated';

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
import ImageUploader from '../common/Upload/ImageUploader';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';

export default function UpdateMyProfileForm() {
  useState<boolean>(false);
  const { data: auth, status } = useSession();
  const { width } = useWindowDimensions();
  const { data: tagData } = useListingTagsQuery();
  const router = useRouter();

  const form = useForm<UpdateMyProfileFormSchema>({
    mode: 'all',
    defaultValues: {
      firstName: auth?.user?.firstName || '',
      lastName: auth?.user?.lastName || '',
      workplaceName: auth?.user?.workplaceName || '',
      phone: auth?.user?.phone || '',
      industryCode: (auth?.user?.industryCode as IndustryCode) || undefined,
      jobTypeCode: (auth?.user?.jobTypeCode as JobTypeCode) || undefined,
      tags: auth?.user?.tags.map((tag) => tag.id + '') || undefined,
      avatarUrl: auth?.user?.avatarUrl || '',
      address: auth?.user?.address || '',
    },
    resolver: zodResolver(updateMyProfileFormSchema),
  });

  const { trigger, isMutating: isUpdating } = useUpdateMyProfileMutation({
    onSuccess() {
      toast.success('Update profile successfully!');
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

  function handleUpdateMyProfile(data: UpdateMyProfileFormSchema) {
    trigger({
      updateUserRequest: {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        tags: data.tags?.map((id) => +id),
        avatarUrl: data.avatarUrl,
        workplaceName: data.workplaceName,
        phone: data.phone,
        industryCode: data.industryCode,
        jobTypeCode: data.jobTypeCode,
      },
    });
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
            type='submit'
            isDisabled={!form.formState.isDirty}
            isLoading={isUpdating}
            color='primary'
          >
            Save changes
          </Button>
        </div>
        <div className='w-full mt-10'>
          <div
            className={clsx(
              'grid gap-8 items-center',
              width < 1000 ? 'grid-cols-1' : 'grid-cols-2',
            )}
          >
            <div className='self-start'>
              <FormInput
                id='firstName'
                name='firstName'
                label='firstName'
                required
                placeholder='Kevin'
                className={clsx(
                  status === 'authenticated' && 'bg-slate-100 text-gray-500',
                )}
                control={form.control}
                showError={true}
              />
            </div>
            <div className='self-start'>
              <FormInput
                id='lastName'
                name='lastName'
                label='lastName'
                required
                placeholder='De Bruyne'
                className={clsx(
                  status === 'authenticated' && 'bg-slate-100 text-gray-500',
                )}
                control={form.control}
                showError={true}
              />
            </div>
            <div className='self-start'>
              <FormInput
                id='workplaceName'
                name='workplaceName'
                label='workplaceName'
                placeholder='Place you work or learn'
                className={clsx(
                  status === 'authenticated' && 'bg-slate-100 text-gray-500',
                )}
                control={form.control}
                showError={true}
                rightIcon={
                  <BiSolidSchool
                    className='text-primary'
                    size={20}
                  />
                }
              />
            </div>
            <div className='self-start'>
              <FormInput
                id='phone'
                name='phone'
                label='phone'
                placeholder='0123456789'
                className={clsx(
                  status === 'authenticated' && 'bg-slate-100 text-gray-500',
                )}
                control={form.control}
                showError={true}
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
                label='avatarUrl'
              />

              <ImageUploader
                name='avatarUrl'
                onGetImageUrl={(url) => form.setValue('avatarUrl', url)}
                defaultImageUrl={auth?.user?.avatarUrl}
              />
            </div>
            &nbsp;
            <div className='self-start'>
              <FormCombobox
                label='jobTypeCode'
                options={optionify(JobTypeCode)}
                i18nPath='code.jobType'
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
              <FormCombobox
                label='industryCode'
                options={optionify(IndustryCode)}
                i18nPath='code.industry'
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
              <FormTagsInput
                title='tags'
                name='tags'
                label='tags'
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
