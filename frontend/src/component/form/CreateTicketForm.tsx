import { RadioGroup } from '@nextui-org/react';
import { TicketTypeRadio } from '../common/RadioGroup';
import clsx from 'clsx';
import { styles } from '@/src/constant/styles.constant';
import { FormCustomLabel, FormInput, FormTextarea } from './Form';
import type { UseFormReturn } from 'react-hook-form';

interface CreateTicketFormProps {
  form: UseFormReturn<any>;
}

function CreateTicketForm({ form }: CreateTicketFormProps) {
  return (
    <div className='my-6 pt-6 grid grid-cols-2 gap-4 border-t border-t-primary'>
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
          name='ticket.name'
          placeholder='100'
          control={form.control}
          isDisplayError={true}
          className={clsx(
            form.formState.errors.tickets &&
              form.formState.touchedFields.tickets &&
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
          name='ticket.quantity'
          placeholder='100'
          control={form.control}
          isDisplayError={true}
          type='number'
          className={clsx(
            form.formState.errors.tickets &&
              form.formState.touchedFields.tickets &&
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
          name='ticket.price'
          placeholder='100'
          control={form.control}
          isDisplayError={true}
          type='number'
          className={clsx(
            form.formState.errors.tickets &&
              form.formState.touchedFields.tickets &&
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
          name='ticket.description'
          placeholder='100'
          control={form.control}
          isDisplayError={true}
          className={clsx(
            form.formState.errors.tickets &&
              form.formState.touchedFields.tickets &&
              'border-error-main',
          )}
        />
      </div>
    </div>
  );
}

export default CreateTicketForm;
