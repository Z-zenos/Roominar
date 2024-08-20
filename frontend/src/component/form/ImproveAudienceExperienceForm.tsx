'use client';

import { useForm } from 'react-hook-form';
import { Form, FormCombobox } from './Form';
import type { ImproveAudienceExperienceFormSchema } from '@/src/schemas/audience/ImproveAudienceExperienceFormSchema';
import { improveAudienceExperienceFormSchema } from '@/src/schemas/audience/ImproveAudienceExperienceFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '../common/Label';
import clsx from 'clsx';
import { styles } from '@/src/constant/styles.constant';
import { JobTypeCodeMapping } from '@/src/constant/code.constant';
import { IndustryCode } from '@/src/lib/api/generated';
import { parseCode } from '@/src/util/app.util';
import Tag from '../common/Tag';

interface ImproveExperienceFormProps {
  token: string;
}

function ImproveExperienceForm({ token }: ImproveExperienceFormProps) {
  console.log(token);
  const form = useForm<ImproveAudienceExperienceFormSchema>({
    mode: 'all',
    defaultValues: {
      industryCode: undefined,
      jobTypeCode: undefined,
      tags: [],
    },
    resolver: zodResolver(improveAudienceExperienceFormSchema),
  });

  // const {
  //   trigger,
  //   data,
  //   isMutating: isLoading,
  // } = useRegisterAudienceMutation({
  //   onSuccess() {
  //     toast.success('Successfully Account Registration!');
  //     setIsRegisterSuccess(true);
  //   },
  //   onError(error) {
  //     const apiException = error as ApiException<string>;
  //     const body = JSON.parse(apiException.body);
  //     toast.error(body.message);
  //   },
  // });

  const handleImproveUserExperience = (value: ImproveAudienceExperienceFormSchema) => {
    // form.trigger({
    //   registerAudienceRequest: {
    //     email: value.email,
    //     firstName: value.firstName,
    //     lastName: value.lastName,
    //     password: value.password,
    //     confirmPassword: value.confirmPassword,
    //   },
    // });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleImproveUserExperience)}
        className={clsx('flex items-center justify-center flex-col')}
      >
        <div className={clsx(styles.between, 'flex-wrap gap-20')}>
          <div>
            <div className='mb-6 block'>
              <Label htmlFor='email' className={clsx(styles.label, 'font-medium text-xm')}>
                Job Type
              </Label>
              <h4 className='font-light opacity-80 text-sm'>
                Explore Opportunities Tailored to Your Profession and <br />
                Discover Career Paths Suited to Your Skillset.
              </h4>
            </div>
            <FormCombobox
              data={Object.keys(JobTypeCodeMapping).map((key: string) => ({
                value: key,
                label: JobTypeCodeMapping[key],
              }))}
              name='jobTypeCode'
              control={form.control}
              title='type job'
              multiple={false}
              className='w-full'
            />
          </div>

          <div>
            <div className='mb-6 block'>
              <Label htmlFor='email' className={clsx(styles.label, 'font-medium text-xm')}>
                Industry
              </Label>
              <h4 className='font-light opacity-80 text-sm'>
                Navigate Through Industry-Specific Insights and Unlock <br />
                the Latest Trends in Your Industry.
              </h4>
            </div>
            <FormCombobox
              data={Object.keys(IndustryCode).map((ic: string) => ({
                value: IndustryCode[ic],
                label: parseCode(IndustryCode[ic]),
              }))}
              name='industryCode'
              control={form.control}
              title='type job'
              multiple={false}
              className='w-full'
            />
          </div>
        </div>

        <div className='py-20'>
          <Label htmlFor='email' className={clsx(styles.label, 'font-medium text-xm')}>
            Tags
          </Label>
          <h4 className='font-light opacity-80 text-sm'>Select fields that you like.</h4>

          <div className='flex justify-center gap-3 items-center py-8'>
            <Tag title='React' />
            <Tag title='React' />
            <Tag title='React' />
            <Tag title='React' />
            <Tag title='React' />
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ImproveExperienceForm;
