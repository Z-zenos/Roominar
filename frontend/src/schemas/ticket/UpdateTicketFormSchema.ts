import {
  TicketDeliveryMethodCode,
  // TicketStatusCode,
  TicketTypeCode,
} from '@/src/lib/api/generated';
import z from 'zod';

const updateTicketFormSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().nullable(),
  quantity: z.coerce.number(),
  price: z.coerce
    .number()
    .default(0)
    .refine((val) => val >= 0, {
      message: 'invalidTicketPrice',
      path: ['price'],
    }),
  type: z.nativeEnum(TicketTypeCode),
  deliveryMethod: z.nativeEnum(TicketDeliveryMethodCode),
  salesStartAt: z.date().optional(),
  salesEndAt: z.date().optional(),
});

type UpdateTicketFormSchema = z.infer<typeof updateTicketFormSchema>;

export type { UpdateTicketFormSchema };
export { updateTicketFormSchema };
