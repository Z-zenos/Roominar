'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiMail } from 'react-icons/hi';
import clsx from 'clsx';
import { styles } from '@/src/constant/styles.constant';
import type { EventApplicationFormSchema } from '@/src/schemas/audience/EventApplicationFormSchema';
import eventApplicationFormSchema from '@/src/schemas/audience/EventApplicationFormSchema';
import {
  Form,
  FormCheckBox,
  FormCheckBoxList,
  FormCombobox,
  FormInput,
  FormRadioBoxList,
} from '@/src/component/form/Form';
import { Label } from '@/src/component/common/Label';
import Button from '@/src/component/common/Button/Button';
import { useGetEventDetailQuery } from '@/src/api/event.api';
import { formatEventDate, parseCode } from '@/src/util/app.util';
import { MdOutlineAccessTime, MdOutlineOnlinePrediction } from 'react-icons/md';
import Chip from '@/src/component/common/Chip';
import { FaUserFriends } from 'react-icons/fa';
import { Image, Link } from '@nextui-org/react';
import { IndustryCode } from '@/src/lib/api/generated';
import { JobTypeCodeMapping } from '@/src/constant/code.constant';

interface EventApplicationFormProps {
  slug: string;
}

export default function EventApplicationForm({
  slug,
}: EventApplicationFormProps) {
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: event } = useGetEventDetailQuery({ slug });

  const form = useForm<EventApplicationFormSchema>({
    mode: 'all',
    defaultValues: {
      email: '',
      ticketId: undefined,
      firstName: '',
      lastName: '',
      workplaceName: '',
      phoneNumber: '',
      industryCode: undefined,
      jobTypeCode: undefined,
      answerResults: [],
      isAccepted: false,
    },
    resolver: zodResolver(eventApplicationFormSchema),
  });

  function handleApplyEvent(data) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleApplyEvent)}
        className={clsx(
          'grid grid-cols-7 w-full items-start gap-10 mx-auto px-[15%] py-20',
        )}
      >
        <div className='col-span-2'>
          {event && (
            <div className='rounded-md p-5 shadow-[rgba(0,_0,_0,_0.02)_0px_1px_3px_0px,_rgba(27,_31,_35,_0.15)_0px_0px_0px_1px]'>
              <div className={'flex justify-between gap-2 items-start mb-3'}>
                <Image
                  src={
                    event.coverImageUrl ??
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVoYkFRN0wzDRnM7OwHq7yINArQLe5UJKV9A&s'
                  }
                  alt='event image'
                  width={100}
                  height={80}
                  className={clsx('w-full h-full rounded-md')}
                />
                <h3 className='font-medium text-nm text-primary line-clamp-2'>
                  {event.name}
                </h3>
              </div>
              <p className='text-sm font-light line-clamp-1 text-gray-700'>
                {event.organizationAddress}
              </p>
              <span className='flex items-center text-ss gap-1 my-2'>
                <MdOutlineAccessTime className='text-nm' />
                {formatEventDate(event.startAt) +
                  '〜' +
                  formatEventDate(event.endAt)}
              </span>
              <div className={clsx(styles.between)}>
                <Chip
                  content={
                    event.appliedNumber + ' / ' + event.applicationNumber
                  }
                  leftIcon={<FaUserFriends className='text-sm' />}
                  type='info'
                />
                {event.meetingToolCode && (
                  <Chip
                    content={event.meetingToolCode}
                    leftIcon={<MdOutlineOnlinePrediction className='text-sm' />}
                    type='success'
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className='col-span-5'>
          <div className='w-full shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] border border-gray-200 px-10 py-6 rounded-md'>
            <h2 className='text-lg font-semibold text-primary'>
              Enter your detail information ✍
            </h2>
            <div className='grid grid-cols-2 gap-8 items-center'>
              <div>
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
              &nbsp;
              <div>
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
              <div>
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
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='workplaceName'
                    className={clsx(styles.label)}
                  >
                    Workplace name
                  </Label>
                </div>
                <FormInput
                  id='workplaceName'
                  name='workplaceName'
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
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='phoneNumber'
                    className={clsx(styles.label)}
                  >
                    Phone number
                  </Label>
                </div>
                <FormInput
                  id='phoneNumber'
                  name='phoneNumber'
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
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='email'
                    className={clsx(styles.label)}
                  >
                    Job Type
                  </Label>
                </div>
                <FormCombobox
                  data={Object.keys(JobTypeCodeMapping).map((key: string) => ({
                    value: key,
                    label: JobTypeCodeMapping[key],
                  }))}
                  name='jobTypeCode'
                  control={form.control}
                  title='type job'
                  multiple={false}
                  className='w-full'
                />
              </div>
              <div>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='email'
                    className={clsx(styles.label)}
                  >
                    Industry
                  </Label>
                </div>
                <FormCombobox
                  data={Object.keys(IndustryCode).map((ic: string) => ({
                    value: IndustryCode[ic],
                    label: parseCode(IndustryCode[ic]),
                  }))}
                  name='industryCode'
                  control={form.control}
                  title='industry'
                  multiple={false}
                  className='w-full'
                />
              </div>
            </div>
          </div>
          <div className='w-full shadow-[rgba(0,_0,_0,_0.16)_0px_1px_4px] border border-gray-200 px-10 py-6 rounded-md mt-6'>
            <h2 className='text-md font-semibold text-secondary'>
              Answer some questions
            </h2>
            <p className='font-light opacity-80 text-sm'>
              Your answers will be an extremely useful and valuable source of
              information to help us survey, analyze and improve the quality of
              future events.
            </p>
            <div className='mt-4 bg-emerald-50 p-5'>
              <h3 className='text-nm font-semibold text-slate-800'>
                1. Oh this is question.
              </h3>
              <FormCheckBoxList
                name='answerResults'
                control={form.control}
                title='Test'
                data={[
                  { value: '1', label: 'This is test answer' },
                  { value: '2', label: 'This is test answer' },
                  { value: '3', label: 'This is test answer' },
                ]}
              />
            </div>

            <div className='mt-4 bg-emerald-50 p-5'>
              <h3 className='text-nm font-semibold text-slate-800'>
                1. Oh this is question.
              </h3>
              <FormRadioBoxList
                name='answerResults'
                control={form.control}
                data={[
                  { value: '1', label: 'This is test answer' },
                  { value: '2', label: 'This is test answer' },
                  { value: '3', label: 'This is test answer' },
                ]}
              />
            </div>
          </div>
          <div className={clsx(styles.center, 'mt-5')}>
            <FormCheckBox
              control={form.control}
              name='isAccepted'
            >
              <p className='text-sm text-gray-600 font-light'>
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
            </FormCheckBox>
          </div>
          <Button
            title='Register'
            type='submit'
            className='w-80 mt-5 mx-auto'
            disabled={!form.formState.isValid}
            isLoading={false}
          />
        </div>
      </form>
    </Form>
  );
}
