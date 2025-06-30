'use client';
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
import {
  createTicketFormSchema,
  type CreateTicketFormSchema,
} from '@/src/schemas/ticket/CreateTicketFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  TicketDeliveryMethodCode,
  TicketTypeCode,
} from '@/src/lib/api/generated';
import { useCreateTicketMutation } from '@/src/api/ticket.api';
import toast from 'react-hot-toast';
import { handleApiError, optionify } from '@/src/utils/app.util';
import type { DateRange } from 'react-day-picker';

interface CreateTicketFormProps {
  eventId?: number;
  onCreate?: () => void;
}

function CreateTicketForm({ eventId, onCreate }: CreateTicketFormProps) {
  const form = useForm<CreateTicketFormSchema & { saleTime?: DateRange }>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      quantity: 0,
      description: '',
      price: 0,
      // expiredAt: undefined,
      type: TicketTypeCode.Free,
      deliveryMethod: TicketDeliveryMethodCode.Both,
      // accessLinkUrl: undefined,
      // status: TicketStatusCode.Available,
      salesStartAt: new Date(),
      salesEndAt: new Date(),
      saleTime: undefined,
    },
    resolver: zodResolver(createTicketFormSchema),
  });

  const { trigger, isMutating: isCreating } = useCreateTicketMutation({
    onSuccess() {
      toast.success('Tạo vé thành công! 🎉');
      onCreate?.();
      form.reset();
    },
    onError: handleApiError,
  });

  function handleCreateTicket(data: CreateTicketFormSchema) {
    trigger({
      createTicketRequest: {
        name: data.name,
        description: data.description,
        quantity: +data?.quantity,
        price: +data?.price,
        type: data.type,
        deliveryMethod: data.deliveryMethod,
        eventId: eventId ?? null,
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
        id='create-ticket-form'
        onSubmit={form.handleSubmit(handleCreateTicket)}
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
            placeholder='Chọn loại vé'
            options={optionify(TicketTypeCode)}
            i18nPath='code.ticket.type'
            className='w-full'
          />
        </div>

        <Button
          color='primary'
          isLoading={isCreating}
          radius='sm'
          className='mt-8 float-end'
          form='create-ticket-form'
          isDisabled={!form.formState.isValid}
          type='submit'
        >
          Tạo vé
        </Button>
      </form>
    </Form>
  );
}

export default CreateTicketForm;
