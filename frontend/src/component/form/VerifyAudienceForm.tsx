'use client';

import { useForm } from 'react-hook-form';
import { Form, FormCombobox } from './Form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '../common/Label';
import clsx from 'clsx';
import { styles } from '@/src/constant/styles.constant';
import { JobTypeCodeMapping } from '@/src/constant/code.constant';
import type {
  ApiException,
  ErrorResponse400,
  TagItem,
} from '@/src/lib/api/generated';
import { IndustryCode } from '@/src/lib/api/generated';
import { parseCode } from '@/src/util/app.util';
import Tag from '../common/Tag/Tag';
import { useListingTagsQuery } from '@/src/api/tag.api';
import TagSkeleton from '../common/Tag/TagSkeleton';
import { useState } from 'react';
import { Button } from '@nextui-org/button';
import type { VerifyAudienceFormSchema } from '@/src/schemas/auth/VerifyAudienceFormSchema';
import { verifyAudienceFormSchema } from '@/src/schemas/auth/VerifyAudienceFormSchema';
import { useVerifyAudienceMutation } from '@/src/api/auth.api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface VerifyAudienceFormProps {
  token: string;
}

function VerifyAudienceForm({ token }: VerifyAudienceFormProps) {
  const { data: tagData, isLoading: isListingTagsLoading } =
    useListingTagsQuery();
  const router = useRouter();

  const form = useForm<VerifyAudienceFormSchema>({
    mode: 'all',
    defaultValues: {
      industryCode: undefined,
      jobTypeCode: undefined,
      tags: [],
    },
    resolver: zodResolver(verifyAudienceFormSchema),
  });

  const { trigger, isMutating: isVerifying } = useVerifyAudienceMutation({
    onSuccess() {
      toast.success('Your account has verified and updated completely!');
      form.reset();
      router.push('/login');
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const handleUpdateAndVerify = (value: VerifyAudienceFormSchema) => {
    trigger({
      token: token,
      verifyAudienceRequest: {
        industryCode: value.industryCode,
        jobTypeCode: value.jobTypeCode,
        tags: value.tags,
      },
    });
  };

  const handleSelectTag = (id: number) => {
    if (selectedTags.includes(id)) {
      setSelectedTags((prev) => prev.filter((tag) => tag !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateAndVerify)}
        className={clsx('flex items-center justify-center flex-col')}
      >
        <div>
          <Button
            className='mr-3 text-black bg-slate-100 border-gray-400 border px-10 font-bold'
            radius='sm'
            variant='solid'
            onClick={() => router.push('/login')}
          >
            Skip
          </Button>
          <Button
            className={clsx(
              ' text-info-main bg-transparent border-info-main border px-10 font-bold',
              !form.formState.isValid &&
                'bg-slate-400, border-slate-400 text-slate-500',
            )}
            radius='sm'
            variant='flat'
            type='submit'
            isLoading={isVerifying}
            disabled={!form.formState.isValid}
          >
            Update & Verify
          </Button>
        </div>
        <div className={clsx(styles.between, 'flex-wrap gap-20 mt-8')}>
          <div>
            <div className='mb-6 block'>
              <Label
                htmlFor='email'
                className={clsx(styles.label, 'font-medium text-xm')}
              >
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
              <Label
                htmlFor='email'
                className={clsx(styles.label, 'font-medium text-xm')}
              >
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
              title='industry'
              multiple={false}
              className='w-full'
            />
          </div>
        </div>

        <div className='py-20'>
          <Label
            htmlFor='email'
            className={clsx(styles.label, 'font-medium text-xm')}
          >
            Tags
          </Label>
          <h4 className='font-light opacity-80 text-sm'>
            Customize your experience by choosing tags that align with your
            goals. <br />
            These tags allow us to tailor content that fits your unique
            professional profile and interests.
          </h4>

          <div className='flex justify-center gap-3 items-center py-8 flex-wrap'>
            {tagData &&
              tagData?.data
                ?.reduce((acc, group) => acc.concat(group.tags), [])
                .map((tag: TagItem) => (
                  <Tag
                    title={tag.name}
                    key={tag.id}
                    id={tag.id}
                    onSelect={handleSelectTag}
                    active={selectedTags.includes(tag.id)}
                  />
                ))}
            {isListingTagsLoading &&
              Array.from({ length: 10 }, (_, k) => <TagSkeleton key={k} />)}
          </div>
        </div>
      </form>
    </Form>
  );
}

export default VerifyAudienceForm;
