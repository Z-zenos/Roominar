'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormCustomLabel,
  FormDateTimePicker,
  FormInput,
  FormInstructions,
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

export default function CreateEventForm() {
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
              type='name'
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

          <div className='self-start'>
            <FormCustomLabel htmlFor='coverImageUrl' />

            <ImageUploader
              name='coverImageUrl'
              onGetImageUrl={(url) => form.setValue('coverImageUrl', url)}
              // defaultImageUrl={auth?.user?.avatarUrl}
            />
            <FormInstructions>
              <li>
                This is the main image for your event. We recommend a 700 x
                350px (2:1 ratio) image.
              </li>
            </FormInstructions>
          </div>
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
