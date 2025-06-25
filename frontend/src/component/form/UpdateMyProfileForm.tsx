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
import { handleApiError, optionify } from '@/src/utils/app.util';

import { JobTypeCode } from '@/src/lib/api/generated';
import { IndustryCode } from '@/src/lib/api/generated';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BiSolidSchool } from 'react-icons/bi';
import { FaPhone } from 'react-icons/fa6';
import useWindowDimensions from '@/src/hooks/useWindowDimension';
import type { UpdateMyProfileFormSchema } from '@/src/schemas/audience/UpdateMyProfileFormSchema';
import updateMyProfileFormSchema from '@/src/schemas/audience/UpdateMyProfileFormSchema';
import { useUpdateMyProfileMutation } from '@/src/api/user.api';
import toast from 'react-hot-toast';
import { styles } from '@/src/constants/styles.constant';
import ImageUploader from '../common/Upload/ImageUploader';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';

export default function UpdateMyProfileForm() {
  useState<boolean>(false);
  const { data: auth, status } = useSession();
  const { width } = useWindowDimensions();
  const router = useRouter();

  const form = useForm<UpdateMyProfileFormSchema>({
    mode: 'all',
    defaultValues: {
      firstName: '',
      lastName: '',
      workplaceName: '',
      phone: '',
      industryCode: undefined,
      jobTypeCode: undefined,
      tags: undefined,
      avatarUrl: '',
      address: '',
    },
    resolver: zodResolver(updateMyProfileFormSchema),
  });

  useEffect(() => {
    form.reset({
      firstName: auth?.user?.firstName || '',
      lastName: auth?.user?.lastName || '',
      workplaceName: auth?.user?.workplaceName || '',
      phone: auth?.user?.phone || '',
      industryCode: (auth?.user?.industryCode as IndustryCode) || undefined,
      jobTypeCode: (auth?.user?.jobTypeCode as JobTypeCode) || undefined,
      tags: auth?.user?.tags.map((tag) => tag.id) || undefined,
      avatarUrl: auth?.user?.avatarUrl || '',
      address: auth?.user?.address || '',
    });
  }, [auth, form]);

  const { trigger, isMutating: isUpdating } = useUpdateMyProfileMutation({
    onSuccess() {
      toast.success('Update profile successfully!');
      form.reset();
      router.refresh();
    },
    onError: handleApiError,
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
        className='lg:w-[800px] w-full mx-auto 450px:px-0 px-[5%]'
      >
        <div
          className={clsx(styles.between, 'py-5 border-b border-b-slate-300')}
        >
          <div>
            <h3 className='text-xm font-semibold mb-1'>Profile</h3>
            <p className='opacity-50 font-light text-sm'>
              Xem và cập nhật thông tin cá nhân của bạn
            </p>
          </div>
          <Button
            type='submit'
            isDisabled={!form.formState.isDirty}
            isLoading={isUpdating}
            color='primary'
          >
            Lưu thay đổi
          </Button>
        </div>
        <div className='w-full mt-10'>
          <div
            className={clsx(
              'grid 450px:gap-8 gap-4 items-center',
              width < 1000 ? 'grid-cols-1' : 'grid-cols-2',
            )}
          >
            <div className='self-start 450px:col-span-1 col-span-2'>
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
            <div className='self-start 450px:col-span-1 col-span-2'>
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
            <div className='self-start 450px:col-span-1 col-span-2'>
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
            <div className='self-start 450px:col-span-1 col-span-2'>
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
            <div className='self-start 450px:col-span-1 col-span-2'>
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
            <div className='self-start 450px:col-span-1 col-span-2'>
              <FormCombobox
                label='jobTypeCode'
                options={optionify(JobTypeCode)}
                i18nPath='code.jobType'
                name='jobTypeCode'
                control={form.control}
                title='type job'
                multiple={false}
                className={clsx('w-full')}
              />
            </div>
            <div className='self-start 450px:col-span-1 col-span-2'>
              <FormCombobox
                label='industryCode'
                options={optionify(IndustryCode)}
                i18nPath='code.industry'
                name='industryCode'
                control={form.control}
                title='industry'
                multiple={false}
                className={clsx('w-full')}
              />
            </div>
            <div className='col-span-2'>
              {form.getValues('tags') && (
                <FormTagsInput
                  title='tags'
                  name='tags'
                  label='tags'
                  control={form.control}
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
