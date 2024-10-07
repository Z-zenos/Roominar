'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormCheckBox,
  FormCustomLabel,
  FormDateTimePicker,
  FormInput,
  FormInstructions,
  FormSelect,
} from '@/src/component/form/Form';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import { EventMeetingToolCode, EventStatusCode } from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import type { PublishEventFormSchema } from '@/src/schemas/event/CreateEventFormSchema';
import publishEventFormSchema from '@/src/schemas/event/CreateEventFormSchema';
import { usePublishEventMutation } from '@/src/api/event.api';
import clsx from 'clsx';
import EventCard from '../common/Card/EventCard';
import ImageUploader from '../common/Upload/ImageUploader';
import { styles } from '@/src/constant/styles.constant';
import { useTranslations } from 'next-intl';
import { cn, toSelectItem } from '@/src/util/app.util';
import {
  CityCodeMappings,
  EventMeetingToolCodeMappings,
} from '@/src/constant/code.constant';
import { Checkbox } from '@nextui-org/react';
import { FaChevronRight } from 'react-icons/fa6';

export default function CreateEventForm() {
  const t = useTranslations('form');

  const form = useForm<PublishEventFormSchema>({
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      coverImageUrl: '',
      questionnaireId: null,
      targetId: null,
      comment: '',
      status: EventStatusCode.Draft,

      startAt: '',
      endAt: '',
      applicationStartAt: '',
      applicationEndAt: '',

      isOnline: null,
      isOffline: null,
      organizeAddress: '',
      organizePlaceName: '',
      organizeCityCode: null,
      meetingToolCode: null,
      meetingUrl: '',

      applicationNumber: 0,
      tickets: [],
    },
    resolver: zodResolver(publishEventFormSchema),
  });

  const { trigger, isMutating: isApplying } = usePublishEventMutation({
    onSuccess() {
      toast.success('Publish event successfully!');
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

  function handlePublishEvent(data: PublishEventFormSchema) {
    // trigger({
    //   eventId: 0,
    //   publishEventRequest: {
    //     ...data,
    //   },
    // });
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handlePublishEvent)}
        className='grid grid-cols-12 items-start gap-10'
      >
        <div className='grid grid-cols-2 gap-6 [&>div]:w-full bg-white rounded-md p-6 shadow-md col-span-9'>
          <div className='col-span-2'>
            <FormCustomLabel
              htmlFor='name'
              required
            />
            <FormInput
              id='name'
              name='name'
              placeholder='registermail@gmail.com'
              control={form.control}
              isDisplayError={true}
              className={clsx(
                form.formState.errors.name &&
                  form.formState.touchedFields.name &&
                  'border-error-main',
              )}
            />
          </div>
          <div className='col-span-1'>
            <FormCustomLabel htmlFor='startAt' />
            <FormDateTimePicker
              name='startAt'
              control={form.control}
            />
          </div>
          <div>
            <FormCustomLabel htmlFor='endAt' />
            <FormDateTimePicker
              name='endAt'
              control={form.control}
            />
          </div>

          <div className='col-span-1'>
            <FormCustomLabel htmlFor='applicationStartAt' />
            <FormDateTimePicker
              name='applicationStartAt'
              control={form.control}
            />
          </div>
          <div>
            <FormCustomLabel htmlFor='applicationEndAt' />
            <FormDateTimePicker
              name='applicationEndAt'
              control={form.control}
            />
          </div>

          <div className='col-span-2'>
            <FormCustomLabel htmlFor='coverImageUrl' />

            <ImageUploader
              name='coverImageUrl'
              onGetImageUrl={(url) => form.setValue('coverImageUrl', url)}
              variant='cover'
              // defaultImageUrl={auth?.user?.avatarUrl}
            />
            <FormInstructions>
              <li>
                This is the main image for your event. We recommend a 700 x
                350px (2:1 ratio) image.
              </li>
            </FormInstructions>
          </div>

          {/* === EVENT FORMAT & ADDRESS === */}
          <h3 className='col-span-2 text-md p-3 border-l-4 border-l-primary'>
            Event format & address ⛩️
          </h3>

          <Checkbox
            aria-label='isOnline'
            name='isOnline'
            classNames={{
              base: cn(
                'inline-flex w-full max-w-full col-span-2 bg-content1',
                'hover:bg-content2 items-center justify-start',
                'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                'data-[selected=true]:border-primary',
              ),
              label: 'w-full',
            }}
            // isSelected={isSelected}
            // onValueChange={setIsSelected}
            onValueChange={(isSelected) =>
              form.setValue('isOnline', isSelected)
            }
          >
            <div className='w-full flex justify-between items-center gap-2'>
              <span className={styles.flexStart}>
                {t('label.isOnline')}
                <FaChevronRight className='mx-4' />
              </span>
              <div>
                <FormCustomLabel htmlFor='meetingToolCode' />
                <FormSelect
                  name='meetingToolCode'
                  control={form.control}
                  data={toSelectItem(EventMeetingToolCodeMappings)}
                />
              </div>
              <div className='grow'>
                <FormCustomLabel htmlFor='meetingUrl' />
                <FormInput
                  id='meetingUrl'
                  name='meetingUrl'
                  placeholder='https://meet.google.com/ass-asfas-12'
                  control={form.control}
                  isDisplayError={true}
                  className={clsx(
                    form.formState.errors.meetingUrl &&
                      form.formState.touchedFields.meetingUrl &&
                      'border-error-main',
                  )}
                />
              </div>
            </div>
          </Checkbox>

          <Checkbox
            aria-label='isOffline'
            name='isOffline'
            classNames={{
              base: cn(
                'inline-flex w-full max-w-full col-span-2 bg-content1',
                'hover:bg-content2 items-center justify-start',
                'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                'data-[selected=true]:border-primary',
              ),
              label: 'w-full',
            }}
            onValueChange={(isSelected) =>
              form.setValue('isOffline', isSelected)
            }
          >
            <div className='w-full flex justify-between items-center gap-2'>
              <span className={styles.flexStart}>
                {t('label.isOffline')}
                <FaChevronRight className='mx-4' />
              </span>
              <div>
                <FormCustomLabel htmlFor='organizeCityCode' />
                <FormSelect
                  name='organizeCityCode'
                  control={form.control}
                  data={toSelectItem(CityCodeMappings)}
                />
              </div>
              <div className='grow'>
                <FormCustomLabel htmlFor='organizeAddress' />
                <FormInput
                  id='organizeAddress'
                  name='organizeAddress'
                  placeholder='12 Hồ Chí Minh, Hoàn Kiếm, Hà Nội'
                  control={form.control}
                  isDisplayError={true}
                  className={clsx(
                    form.formState.errors.organizeAddress &&
                      form.formState.touchedFields.organizeAddress &&
                      'border-error-main',
                  )}
                />
              </div>
            </div>
          </Checkbox>

          <div className='border-y border-y-primary py-[2px] my-4 col-span-2'>
            <div className='border-y border-y-primary py-2'>
              <h3 className='text-center text-md '>Description 🗒</h3>
            </div>
          </div>

          <div className='col-span-2'></div>

          {/* === EVENT APPLICATION NUMBER & TICKETS === */}
          <h3 className='col-span-2 text-md p-3 border-l-4 border-l-primary'>
            Tickets 🎟
          </h3>
        </div>

        <div className='col-span-3'>
          {/* <EventCard
            event={{
              id: 1,
              slug: '',
              organizationName: 'Roominar',
              name: form.getValues('name'),
              startAt: new Date('2024-10-06'),
              endAt: new Date('2024-10-06'),
              applicationStartAt: new Date('2024-10-06'),
              applicationEndAt: new Date('2024-10-06'),
              applicationNumber: 1,
              coverImageUrl: '',
              meetingToolCode: EventMeetingToolCode.Discord,
              isOffline: true,
              publishedAt: new Date('2024-10-06'),
              tags: [],
            }}
            className='w-full'
          /> */}
        </div>
      </form>
    </Form>
  );
}
