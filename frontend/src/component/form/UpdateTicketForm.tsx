import { Button } from '@nextui-org/react';
import {
  Form,
  FormDateRangePicker,
  FormInput,
  FormInstructions,
  FormRadioBoxList,
  FormSelect,
  FormTextarea,
} from './Form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import {
  TicketDeliveryMethodCode,
  TicketTypeCode,
} from '@/src/lib/api/generated';
import toast from 'react-hot-toast';
import { optionify } from '@/src/utils/app.util';
import {
  updateTicketFormSchema,
  type UpdateTicketFormSchema,
} from '@/src/schemas/ticket/UpdateTicketFormSchema';
import {
  useGetDraftTicketQuery,
  useUpdateTicketMutation,
} from '@/src/api/ticket.api';
import { useEffect } from 'react';
import type { DateRange } from 'react-day-picker';

interface UpdateTicketFormProps {
  ticketId: number;
  onUpdate?: () => void;
}

function UpdateTicketForm({ ticketId, onUpdate }: UpdateTicketFormProps) {
  const { data: ticket } = useGetDraftTicketQuery({
    ticketId: ticketId,
  });

  const form = useForm<UpdateTicketFormSchema & { saleTime: DateRange }>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      quantity: 0,
      description: '',
      price: 0,
      type: TicketTypeCode.Free,
      deliveryMethod: TicketDeliveryMethodCode.Both,
      salesStartAt: new Date(),
      salesEndAt: new Date(),
      saleTime: undefined,
    },
    resolver: zodResolver(updateTicketFormSchema),
  });

  useEffect(() => {
    form.reset({
      name: ticket?.name,
      quantity: ticket?.quantity,
      description: ticket?.description ?? undefined,
      price: ticket?.price,
      type: ticket?.type as TicketTypeCode,
      deliveryMethod: ticket?.deliveryMethod,
      salesStartAt: ticket?.salesStartAt,
      salesEndAt: ticket?.salesEndAt,
      saleTime: {
        from: ticket?.salesStartAt,
        to: ticket?.salesEndAt,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ticket)]);

  const { trigger, isMutating: isUpdating } = useUpdateTicketMutation({
    onSuccess(updatedData) {
      toast.success('Update ticket successfully!');
      onUpdate?.();
      form.reset({
        name: updatedData.name,
        quantity: updatedData.quantity,
        description: updatedData.description ?? undefined,
        price: updatedData.price,
        type: updatedData.type,
        deliveryMethod: updatedData.deliveryMethod,
        salesStartAt: updatedData.salesStartAt,
        salesEndAt: updatedData.salesEndAt,
        saleTime: {
          from: updatedData.salesStartAt,
          to: updatedData.salesEndAt,
        },
      });
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  function handleUpdateTicket(data: UpdateTicketFormSchema) {
    trigger({
      ticketId: ticketId,
      updateTicketRequest: {
        name: data.name,
        description: data.description,
        quantity: +data?.quantity,
        price: +data?.price,
        type: data.type,
        deliveryMethod: data.deliveryMethod,
        expiredAt: null,
        salesStartAt: form.getValues('saleTime')?.from,
        salesEndAt: form.getValues('saleTime')?.to,
        accessLinkUrl: null,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        id='update-ticket-form'
        onSubmit={form.handleSubmit(handleUpdateTicket)}
        className='my-6 pt-6 grid grid-cols-2 gap-4 border-t border-t-primary'
      >
        <FormInstructions className='col-span-2'>
          <li>Nếu bạn muốn tạo vé miễn phí, hãy đặt giá vé là 0.</li>
        </FormInstructions>
        <div className='col-span-2'>
          <FormRadioBoxList
            name='deliveryMethod'
            control={form.control}
            options={optionify(TicketDeliveryMethodCode)}
            i18nPath='code.ticket.deliveryMethod'
            direction='horizontal'
            required
          />
        </div>
        <div className='col-span-2 mt-4'>
          <FormInput
            id='ticketName'
            name='name'
            label='ticketName'
            required
            control={form.control}
            showError={true}
          />
        </div>

        <div>
          <FormInput
            id='ticketQuantity'
            name='quantity'
            label='ticketQuantity'
            required
            placeholder='100'
            control={form.control}
            showError={true}
            type='number'
          />
        </div>

        <div>
          <FormInput
            id='ticketPrice'
            name='price'
            label='ticketPrice'
            required
            placeholder='100'
            control={form.control}
            showError={true}
            type='number'
          />
        </div>

        <div className='col-span-2 mt-4'>
          <FormDateRangePicker
            label='ticketSaleTime'
            name='saleTime'
            control={form.control}
            className='w-full'
          />
        </div>

        <div className='col-span-2 mt-4'>
          <FormTextarea
            id='ticketDescription'
            name='description'
            label='ticketDescription'
            placeholder='Mô tả thêm thông tin về vé (ví dụ: điều kiện sử dụng, cách sử dụng, ...)'
            control={form.control}
            showError={true}
          />
        </div>

        <div className='col-span-2 my-4'>
          <FormSelect
            name='type'
            label='ticketType'
            required
            control={form.control}
            placeholder='Select Ticket Type'
            options={optionify(TicketTypeCode)}
            i18nPath='code.ticket.type'
            className='w-full'
          />
        </div>

        <Button
          color='primary'
          isLoading={isUpdating}
          radius='sm'
          className='mt-8 float-end'
          form='update-ticket-form'
          isDisabled={Object.keys(form.formState.errors).length > 0}
          type='submit'
        >
          Cập nhật vé
        </Button>
      </form>
    </Form>
  );
}

export default UpdateTicketForm;
