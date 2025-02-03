import { CityCode, EventMeetingToolCode } from '@/src/lib/api/generated';
import dayjs from 'dayjs';
import z from 'zod';

export const eventDateSchema = z
  .object({
    startAt: z
      .union([z.date(), z.null()])
      .refine((val) => val !== null, {
        message: 'missingEventStartAt',
        path: ['startAt'],
      }),
    endAt: z
      .union([z.date(), z.null()])
      .refine((val) => val !== null, {
        message: 'missingEventEndAt',
        path: ['endAt'],
      }),
    applicationStartAt: z
      .union([z.date(), z.null()])
      .refine((val) => val !== null, {
        message: 'missingEventApplicationStartAt',
        path: ['applicationStartAt'],
      }),
    applicationEndAt: z
      .union([z.date(), z.null()])
      .refine((val) => val !== null, {
        message: 'missingEventApplicationEndAt',
        path: ['applicationEndAt'],
      }),
  })
  .refine(
    // Check endAt > today & startAt & applicationEndAt
    (val) =>
      dayjs(val.endAt).diff(new Date()) > 0 &&
      dayjs(val.endAt).diff(val.startAt) > 0 &&
      dayjs(val.endAt).diff(val.applicationEndAt) > 0,
    {
      message: 'invalidEventEndAt',
      path: ['endAt'],
    },
  )
  .refine(
    // Check applicationStartAt < applicationEndAt & startAt
    (val) =>
      dayjs(val.applicationStartAt).diff(val.startAt) < 0 &&
      dayjs(val.applicationStartAt).diff(val.applicationEndAt) < 0,
    {
      message: 'invalidApplicationStartAt',
      path: ['applicationStartAt'],
    },
  )
  .refine(
    // Check applicationStartAt < applicationEndAt < endAt
    (val) => {
      return (
        dayjs(val.applicationEndAt).diff(val.applicationStartAt) > 0 &&
        dayjs(val.applicationEndAt).diff(val.endAt) < 0
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
    organizeAddress: z.string().trim().max(255).optional(),
    organizeCityCode: z.nativeEnum(CityCode).optional(),
    meetingToolCode: z.nativeEnum(EventMeetingToolCode).optional(),
    meetingUrl: z.string().url().or(z.literal('')),
  })
  .superRefine(
    (
      {
        isOffline,
        isOnline,
        organizeAddress,
        organizeCityCode,
        meetingToolCode,
        meetingUrl,
      },
      ctx,
    ) => {
      if (!(isOffline || isOnline)) {
        ctx.addIssue({
          code: 'custom',
          message: 'neitherOnlineNorOffline',
          path: ['isOffline', 'isOnline'],
        });
      }

      if (isOffline && !organizeCityCode) {
        ctx.addIssue({
          code: 'custom',
          message: 'missingEventOrganizeCityCode',
          path: ['organizeCityCode'],
        });
      }

      if (isOffline && !organizeAddress) {
        ctx.addIssue({
          code: 'custom',
          message: 'missingEventOrganizeAddress',
          path: ['organizeAddress'],
        });
      }

      if (isOnline && !meetingToolCode) {
        ctx.addIssue({
          code: 'custom',
          message: 'missingEventMeetingToolCode',
          path: ['meetingToolCode'],
        });
      }

      if (
        isOnline &&
        meetingToolCode === EventMeetingToolCode.ContactLater &&
        !meetingUrl
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'missingEventMeetingUrl',
          path: ['meetingUrl'],
        });
      }
    },
  );

const eventTicketSchema = z.object({
  totalTicketNumber: z.coerce
    .number()
    .refine((n) => n > 0, { message: 'minimumTotalTicketNumber' }),
  ticketIds: z.array(z.number()),
});

const eventBaseSchema = z.object({
  name: z.string().trim().min(1, { message: 'required' }).max(1024),
  description: z.string().trim().min(1),
  coverImageUrl: z
    .string()
    .trim()
    .min(1, { message: 'required' })
    .url({})
    .max(2048),
  galleryUrls: z.array(z.string().url()).max(10),
  surveyId: z.coerce.number().nullable(),
  targetId: z.coerce.number().nullable(),
  comment: z.string().trim().nullable(),
  tags: z.array(z.coerce.number()).nullable(),
});

const createEventFormSchema = z.intersection(
  eventBaseSchema,
  eventDateSchema.and(eventAddressSchema).and(eventTicketSchema),
);

type CreateEventFormSchema = z.infer<typeof createEventFormSchema>;

export type { CreateEventFormSchema };

export default createEventFormSchema;
