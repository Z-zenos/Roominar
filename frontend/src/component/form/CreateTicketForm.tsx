import { Button, RadioGroup } from '@nextui-org/react';
import { TicketTypeRadio } from '../common/RadioGroup';
import clsx from 'clsx';
import { styles } from '@/src/constant/styles.constant';
import { Form, FormCustomLabel, FormInput, FormTextarea } from './Form';
import { useForm } from 'react-hook-form';
import {
  createTicketFormSchema,
  type CreateTicketFormSchema,
} from '@/src/schemas/ticket/CreateTicketFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import {
  TicketDeliveryMethodCode,
  TicketStatusCode,
  TicketTypeCode,
} from '@/src/lib/api/generated';
import { useCreateTicketMutation } from '@/src/api/ticket.api';
import toast from 'react-hot-toast';

function CreateTicketForm() {
  const form = useForm<CreateTicketFormSchema>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      quantity: 0,
      description: '',
      price: 0,
      expiredAt: null,
      type: TicketTypeCode.Free,
      deliveryMethod: TicketDeliveryMethodCode.Both,
      accessLinkUrl: null,
      isRefundable: null,
      status: TicketStatusCode.Available,
      salesStartAt: new Date(),
      salesEndAt: new Date(),
    },
    resolver: zodResolver(createTicketFormSchema),
  });

  console.log(form.formState.errors);

  const { trigger, isMutating: isCreating } = useCreateTicketMutation({
    onSuccess() {
      toast.success('Create target successfully!');
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
    // trigger({
    //   createTargetRequest: {
    //     ...data,
    //   },
    // });

    console.log(data);
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
          <FormCustomLabel
            htmlFor='ticketName'
            required
          />
          <FormInput
            id='ticketName'
            name='name'
            placeholder='100'
            control={form.control}
            isDisplayError={true}
            className={clsx(
              form.formState.errors.name &&
                form.formState.touchedFields.name &&
                'border-error-main',
            )}
          />
        </div>

        <div>
          <FormCustomLabel
            htmlFor='ticketQuantity'
            required
          />
          <FormInput
            id='ticketQuantity'
            name='quantity'
            placeholder='100'
            control={form.control}
            isDisplayError={true}
            type='number'
            className={clsx(
              form.formState.errors.quantity &&
                form.formState.touchedFields.quantity &&
                'border-error-main',
            )}
          />
        </div>

        <div>
          <FormCustomLabel
            htmlFor='ticketPrice'
            required
          />
          <FormInput
            id='ticketPrice'
            name='price'
            placeholder='100'
            control={form.control}
            isDisplayError={true}
            type='number'
            className={clsx(
              form.formState.errors.price &&
                form.formState.touchedFields.price &&
                'border-error-main',
            )}
          />
        </div>

        <div className='col-span-2 mt-4'>
          <FormCustomLabel
            htmlFor='ticketDescription'
            required
          />
          <FormTextarea
            id='ticketDescription'
            name='description'
            placeholder='100'
            control={form.control}
            isDisplayError={true}
            className={clsx(
              form.formState.errors.description &&
                form.formState.touchedFields.description &&
                'border-error-main',
            )}
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
          Create Target
        </Button>
      </form>
    </Form>
  );
}

export default CreateTicketForm;
