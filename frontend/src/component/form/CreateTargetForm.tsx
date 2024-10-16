import {
  IndustryCodeMapping,
  JobTypeCodeMapping,
} from '@/src/constant/code.constant';
import { FormCustomLabel, FormInput } from './Form';
import type { UseFormReturn } from 'react-hook-form';
import { toSelectItem } from '@/src/util/app.util';
import { Chip } from '@nextui-org/react';
import clsx from 'clsx';

interface CreateTargetFormProps {
  form: UseFormReturn<any>;
}

function CreateTargetForm({ form }: CreateTargetFormProps) {
  return (
    <div className='my-6'>
      <FormCustomLabel
        htmlFor='targetName'
        required
      />
      <FormInput
        id='targetName'
        name='target.name'
        placeholder='AI student and worker'
        control={form.control}
        isDisplayError={true}
        className={clsx(
          form.formState.errors.tickets &&
            form.formState.touchedFields.tickets &&
            'border-error-main',
        )}
      />

      <div className='py-2 mt-8 px-4 bg-primary h-10 relative after:absolute after:w-10 after:z-10 after:rotate-45 after:h-10 after:-top-6 after:bg-white after:-right-6 w-fit overflow-hidden'>
        <FormCustomLabel
          htmlFor='jobTypeCode'
          required
          className='text-white font-semibold'
        />
      </div>
      <div className='h-[250px] overflow-y-scroll bg-slate-50 border-t border-t-primary flex flex-wrap gap-3 py-4'>
        {toSelectItem(JobTypeCodeMapping).map((ic) => (
          <Chip
            key={ic.value}
            variant='bordered'
            radius='sm'
            className='cursor-pointer border-1'
          >
            {ic.label}
          </Chip>
        ))}
      </div>

      <div className='py-2 px-4 mt-8 bg-black h-10 relative after:absolute after:w-10 after:z-10 after:rotate-45 after:h-10 after:-top-6 after:bg-white after:-right-6 w-fit overflow-hidden'>
        <FormCustomLabel
          htmlFor='industryCode'
          required
          className='text-white font-semibold'
        />
      </div>
      <div className='h-[250px] overflow-y-scroll bg-slate-50 border-t border-t-primary flex flex-wrap gap-3 py-4'>
        {toSelectItem(IndustryCodeMapping).map((ic) => (
          <Chip
            key={ic.value}
            variant='bordered'
            radius='sm'
            className='cursor-pointer border-1'
          >
            {ic.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export default CreateTargetForm;
