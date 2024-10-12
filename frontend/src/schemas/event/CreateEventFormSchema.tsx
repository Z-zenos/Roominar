import {
  CityCode,
  EventMeetingToolCode,
  EventStatusCode,
  TicketDeliveryMethodCode,
  TicketStatusCode,
  TicketTypeCode,
} from '@/src/lib/api/generated';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import z from 'zod';

const eventDateSchema = z
  .object({
    startAt: z.custom<Dayjs>(
      (val) => val instanceof dayjs,
      'missingEventStartAt',
    ),
    endAt: z.custom<Dayjs>((val) => val instanceof dayjs, 'missingEventEndAt'),
    applicationStartAt: z.custom<Dayjs>(
      (val) => val instanceof dayjs,
      'missingEventApplicationStartAt',
    ),
    applicationEndAt: z.custom<Dayjs>(
      (val) => val instanceof dayjs,
      'missingEventApplicationEndAt',
    ),
    isApplying: z.boolean().optional(),
  })
  // .refine(
  //   (val) =>
  //     val.isApplying ||
  //     val.startAt.tz('Asia/Ho_Chi_Minh', true).diff(dayjs()) > 60 * 60 * 1000,
  //   {
  //     message: '開始日時を確認してください。',
  //     path: ['startAt'],
  //   },
  // )
  // .refine(
  //   (val) =>
  //     val.isApplying ||
  //     (val.startAt.diff(new Date()) > 0 &&
  //       val.startAt.diff(val.endAt) < 0 &&
  //       val.startAt.diff(val.applicationStartAt) > 0),
  //   {
  //     message: '開始日時を確認してください。',
  //     path: ['startAt'],
  //   },
  // )
  .refine(
    // Check endAt > today & startAt & applicationEndAt
    (val) =>
      val.endAt.diff(new Date()) > 0 &&
      val.endAt.diff(val.startAt) > 0 &&
      val.endAt.diff(val.applicationEndAt) > 0,
    {
      message: 'invalidEventEndAt',
      path: ['endAt'],
    },
  )
  .refine(
    // Check applicationStartAt < applicationEndAt & startAt
    (val) =>
      val.applicationStartAt.diff(val.startAt) < 0 &&
      val.applicationStartAt.diff(val.applicationEndAt) < 0,
    {
      message: 'invalidApplicationStartAt',
      path: ['applicationStartAt'],
    },
  )
  .refine(
    // Check applicationStartAt < applicationEndAt < endAt
    (val) => {
      return (
        val.applicationEndAt.diff(val.applicationStartAt) > 0 &&
        val.applicationEndAt.diff(val.endAt) < 0
      );
    },
    {
      message: 'invalidApplicationEndAt',
      path: ['applicationEndAt'],
    },
  );

const eventAddressSchema = z
  .object({
    isOnline: z.boolean().optional(),
    isOffline: z.boolean().optional(),
    organizePlaceName: z.string().trim().max(255).nullable(),
    organizeAddress: z.string().trim().max(255).nullable(),
    organizeCityCode: z.nativeEnum(CityCode).nullable(),
    meetingToolCode: z.nativeEnum(EventMeetingToolCode).nullable(),
    meetingUrl: z.string().url().nullable(),
  })
  .refine((data) => data.isOffline || data.isOnline, {
    message: 'neitherOnlineNorOffline',
    path: ['isOffline'],
  })
  .refine((data) => data.isOffline || data.isOnline, {
    message: 'neitherOnlineNorOffline',
    path: ['isOnline'],
  })
  .refine(
    (data) =>
      data.isOffline
        ? data.isOffline &&
          typeof data.organizePlaceName !== 'undefined' &&
          typeof data.organizePlaceName === 'string'
          ? data.organizePlaceName !== ''
          : false
        : true,
    {
      message: 'missingEventOrganizePlaceName',
      path: ['organizePlaceName'],
    },
  )
  .refine(
    (data) =>
      data.isOffline
        ? data.isOffline &&
          typeof data.organizeCityCode !== 'undefined' &&
          typeof data.organizeCityCode === typeof CityCode
        : true,
    {
      message: 'missingEventOrganizeCityCode',
      path: ['organizeCityCode'],
    },
  )
  .refine(
    (data) =>
      data.isOffline
        ? data.isOffline &&
          typeof data.organizeAddress !== 'undefined' &&
          typeof data.organizeAddress === 'string'
          ? data.organizeAddress !== ''
          : false
        : true,
    {
      message: 'missingEventOrganizeAddress',
      path: ['organizeAddress'],
    },
  )
  .refine(
    (data) =>
      data.isOnline
        ? data.isOnline &&
          typeof data.meetingToolCode !== 'undefined' &&
          typeof data.meetingToolCode === typeof EventMeetingToolCode
        : true,
    {
      message: 'missingEventMeetingToolCode',
      path: ['meetingToolCode'],
    },
  )
  .refine(
    (data) =>
      data.isOnline &&
      data.meetingToolCode !== EventMeetingToolCode.ContactLater
        ? data.isOnline &&
          typeof data.meetingUrl !== 'undefined' &&
          typeof data.meetingUrl === 'string'
          ? data.meetingUrl !== ''
          : false
        : true,
    {
      message: 'missingEventMeetingUrl',
      path: ['meetingUrl'],
    },
  );

const eventTicketSchema = z.object({
  applicationNumber: z.number(),
  tickets: z.array(
    z.object({
      name: z.string().trim().min(1).max(255),
      description: z.string().trim().nullable(),
      quantity: z.number(),
      price: z
        .number()
        .default(0)
        .refine((val) => val >= 0, {
          message: 'invalidTicketPrice',
          path: ['price'],
        }),
      expiredAt: z.date().optional(),
      type: z.nativeEnum(TicketTypeCode),
      deliveryMethod: z.nativeEnum(TicketDeliveryMethodCode),
      accessLinkUrl: z.string().trim().url().optional(),
      isRefundable: z.boolean().optional(),
      status: z.nativeEnum(TicketStatusCode).optional(),
    }),
  ),
});

const eventBaseSchema = z.object({
  name: z.string().trim().min(1).max(1024),
  description: z.string().trim().min(1),
  coverImageUrl: z.string().url().max(2048),
  survey_id: z.number().nullable(),
  targetId: z.number(),
  comment: z.string().trim().nullable(),
  status: z.nativeEnum(EventStatusCode),
  tags: z.array(z.string()).nullable(),
});

const publishEventFormSchema = z.intersection(
  eventBaseSchema,
  eventDateSchema.and(eventAddressSchema).and(eventTicketSchema),
);

type PublishEventFormSchema = z.infer<typeof publishEventFormSchema>;

export type { PublishEventFormSchema };

export default publishEventFormSchema;
