import {
  TicketDeliveryMethodCode,
  TicketStatusCode,
  TicketTypeCode,
} from '@/src/lib/api/generated';
import z from 'zod';

const createTicketFormSchema = z
  .object({
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
    salesStartAt: z.date().nullable(),
    salesEndAt: z.date().nullable(),
  })
  .superRefine(({ salesStartAt, salesEndAt }, ctx) => {
    if (salesEndAt < salesStartAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ticketSalesEndAtLessThanSalesStartAt',
        path: ['salesStartAt', 'salesEndAt'],
      });
    }
  });

type CreateTicketFormSchema = z.infer<typeof createTicketFormSchema>;

export type { CreateTicketFormSchema };
export { createTicketFormSchema };
