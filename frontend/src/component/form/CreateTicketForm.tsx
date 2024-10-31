import { Button, RadioGroup } from '@nextui-org/react';
import { TicketTypeRadio } from '../common/RadioGroup';
import clsx from 'clsx';
import { styles } from '@/src/constant/styles.constant';
import {
  Form,
  FormInput,
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
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import {
  TicketDeliveryMethodCode,
  TicketTypeCode,
} from '@/src/lib/api/generated';
import { useCreateTicketMutation } from '@/src/api/ticket.api';
import toast from 'react-hot-toast';
import { optionify } from '@/src/util/app.util';

interface CreateTicketFormProps {
  eventId?: number;
}

function CreateTicketForm({ eventId }: CreateTicketFormProps) {
  const form = useForm<CreateTicketFormSchema>({
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
      // isRefundable: undefined,
      // status: TicketStatusCode.Available,
      salesStartAt: new Date(),
      salesEndAt: new Date(),
    },
    resolver: zodResolver(createTicketFormSchema),
  });

  const { trigger, isMutating: isCreating } = useCreateTicketMutation({
    onSuccess() {
      toast.success('Create ticket successfully!');
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
        isRefundable: null,
        salesStartAt: null,
        salesEndAt: null,
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
        <RadioGroup className='col-span-2'>
          <div className={clsx(styles.flexStart, 'gap-3')}>
            <TicketTypeRadio
              // description='Up to 20 items'
              value='free'
            >
              Free
            </TicketTypeRadio>
            <TicketTypeRadio
              // description='Unlimited items. $10 per month.'
              value='paid'
            >
              Paid
            </TicketTypeRadio>
          </div>
        </RadioGroup>

        <div className='col-span-2 mt-4'>
          <FormInput
            id='ticketName'
            name='name'
            label='ticketName'
            required
            placeholder='100'
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
          <FormTextarea
            id='ticketDescription'
            name='description'
            label='ticketDescription'
            required
            placeholder='100'
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

        <div className='col-span-2'>
          <FormRadioBoxList
            name='deliveryMethod'
            label='deliveryMethod'
            control={form.control}
            options={optionify(TicketDeliveryMethodCode)}
            i18nPath='code.ticket.deliveryMethod'
            direction='horizontal'
            required
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
          Create Ticket
        </Button>
      </form>
    </Form>
  );
}

export default CreateTicketForm;
