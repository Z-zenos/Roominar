import {
  IndustryCodeMapping,
  JobTypeCodeMapping,
} from '@/src/constant/code.constant';
import { Form, FormCustomLabel, FormField, FormInput, FormItem } from './Form';
import type { ControllerRenderProps } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toSelectItem } from '@/src/util/app.util';
import { Button, Chip } from '@nextui-org/react';
import clsx from 'clsx';
import type { CreateTargetFormSchema } from '@/src/schemas/target/CreateTargetFormSchema';
import { createTargetFormSchema } from '@/src/schemas/target/CreateTargetFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTargetMutation } from '@/src/api/target.api';
import toast from 'react-hot-toast';
import type {
  ApiException,
  CreateTargetRequest,
  ErrorResponse400,
  IndustryCode,
  JobTypeCode,
} from '@/src/lib/api/generated';

function CreateTargetForm() {
  const form = useForm<CreateTargetFormSchema>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      industryCodes: [],
      jobTypeCodes: [],
    },
    resolver: zodResolver(createTargetFormSchema),
  });

  const { trigger, isMutating: isCreating } = useCreateTargetMutation({
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

  function handleCreateTarget(data: CreateTargetRequest) {
    trigger({
      createTargetRequest: {
        ...data,
      },
    });
  }

  function handleToggle(
    field: ControllerRenderProps<any, string>,
    value: string,
  ) {
    let newItems = null;

    if (field?.value.includes(value)) {
      newItems = field?.value?.filter((value: string) => value !== value);
    } else {
      newItems = field?.value ? [...field.value, value] : [value];
    }
    field.onChange(newItems);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateTarget)}
        className='my-6'
        id='create-target-form'
      >
        <FormCustomLabel
          htmlFor='name'
          required
        />
        <FormInput
          id='name'
          name='name'
          placeholder='AI student and worker'
          control={form.control}
          isDisplayError={true}
        />

        <div className='py-2 mt-8 px-4 bg-primary h-10 relative after:absolute after:w-10 after:z-10 after:rotate-45 after:h-10 after:-top-6 after:bg-white after:-right-6 w-fit overflow-hidden'>
          <FormCustomLabel
            htmlFor='jobTypeCode'
            required
            className='text-white font-semibold'
          />
        </div>
        <div className='h-[250px] overflow-y-scroll bg-slate-50 border-t border-t-primary py-4'>
          <FormField
            control={form.control}
            name='jobTypeCodes'
            render={({ field }) => (
              <FormItem className=' flex flex-wrap gap-3 space-y-0'>
                {toSelectItem(JobTypeCodeMapping).map((ic) => (
                  <Chip
                    key={ic.value}
                    variant='bordered'
                    radius='sm'
                    className={clsx(
                      'cursor-pointer border-1',
                      form
                        .getValues('jobTypeCodes')
                        .includes(ic.value as JobTypeCode) &&
                        'bg-primary text-white border-primary',
                    )}
                    onClick={() => handleToggle(field, ic.value as JobTypeCode)}
                  >
                    {ic.label}
                  </Chip>
                ))}
              </FormItem>
            )}
          />
        </div>

        <div className='py-2 px-4 mt-8 bg-black h-10 relative after:absolute after:w-10 after:z-10 after:rotate-45 after:h-10 after:-top-6 after:bg-white after:-right-6 w-fit overflow-hidden'>
          <FormCustomLabel
            htmlFor='industryCode'
            required
            className='text-white font-semibold'
          />
        </div>
        <div className='h-[250px] overflow-y-scroll bg-slate-50 border-t border-t-primary py-4'>
          <FormField
            control={form.control}
            name='industryCodes'
            render={({ field }) => (
              <FormItem className='flex flex-wrap gap-3 space-y-0'>
                {toSelectItem(IndustryCodeMapping).map((ic) => (
                  <Chip
                    key={ic.value}
                    variant='bordered'
                    radius='sm'
                    className={clsx(
                      'cursor-pointer border-1',
                      form
                        .getValues('industryCodes')
                        .includes(ic.value as IndustryCode) &&
                        'bg-primary text-white border-primary',
                    )}
                    onClick={() =>
                      handleToggle(field, ic.value as IndustryCode)
                    }
                  >
                    {ic.label}
                  </Chip>
                ))}
              </FormItem>
            )}
          />
        </div>

        <Button
          color='primary'
          isLoading={isCreating}
          radius='sm'
          className='mt-8 float-end'
          form='create-target-form'
          isDisabled={!form.formState.isValid}
          type='submit'
        >
          Create Target
        </Button>
      </form>
    </Form>
  );
}

export default CreateTargetForm;
