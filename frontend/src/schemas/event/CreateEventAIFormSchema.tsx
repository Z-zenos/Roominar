import { CityCode } from '@/src/lib/api/generated';
import dayjs from 'dayjs';
import z from 'zod';

export const eventDateSchema = z
  .object({
    startAt: z.union([z.date(), z.null()]).refine((val) => val !== null, {
      message: 'missingEventStartAt',
      path: ['startAt'],
    }),
    endAt: z.union([z.date(), z.null()]).refine((val) => val !== null, {
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
    isOnline: z.boolean().nullable(),
    isOffline: z.boolean().nullable(),
    organizeAddress: z.string().trim().max(255).or(z.literal('')),
    organizeCityCode: z.nativeEnum(CityCode).optional(),
  })
  .superRefine(
    ({ isOffline, isOnline, organizeAddress, organizeCityCode }, ctx) => {
      if (!isOffline && !isOnline) {
        ctx.addIssue({
          code: 'custom',
          message: 'neitherOnlineNorOffline',
          path: ['isOffline'],
        });
      }

      if (isOffline && !organizeCityCode) {
        ctx.addIssue({
          code: 'custom',
          message: 'missingEventOrganizeCityCode',
          path: ['isOffline'],
        });
      }

      if (isOffline && !organizeAddress) {
        ctx.addIssue({
          code: 'custom',
          message: 'missingEventOrganizeAddress',
          path: ['organizeAddress'],
        });
      }
    },
  );

const eventBaseSchema = z.object({
  name: z.string().trim().min(1, { message: 'required' }).max(1024),
  description: z.string().trim().min(1),
  tags: z.array(z.coerce.number()).nullable(),
  totalTicketNumber: z.coerce
    .number()
    .refine((n) => n > 0, { message: 'minimumTotalTicketNumber' }),
  price: z.coerce.number(),
});

const createEventAIFormSchema = z.intersection(
  eventBaseSchema,
  eventDateSchema.and(eventAddressSchema),
);

type CreateEventAIFormSchema = z.infer<typeof createEventAIFormSchema>;

export type { CreateEventAIFormSchema };

export default createEventAIFormSchema;
