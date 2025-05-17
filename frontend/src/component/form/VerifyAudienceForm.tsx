'use client';

import { useForm } from 'react-hook-form';
import { Form, FormCombobox, FormCustomLabel } from './Form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '../common/Label';
import clsx from 'clsx';
import { styles } from '@/src/constants/styles.constant';

import {
  IndustryCode,
  JobTypeCode,
  type ApiException,
  type ErrorResponse400,
} from '@/src/lib/api/generated';
import { optionify } from '@/src/utils/app.util';
import Tag from '../common/Tag/Tag';
import { useListingTagsQuery } from '@/src/api/tag.api';
import TagSkeleton from '../common/Tag/TagSkeleton';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import type { VerifyAudienceFormSchema } from '@/src/schemas/auth/VerifyAudienceFormSchema';
import { verifyAudienceFormSchema } from '@/src/schemas/auth/VerifyAudienceFormSchema';
import { useVerifyAudienceMutation } from '@/src/api/auth.api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import type ITag from '@/src/types/Tag';

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
  const [tags, setTags] = useState<ITag[]>([]);

  useEffect(() => {
    if (tagData?.data) {
      setTags(
        tagData.data.map((tagGroup) => ({
          groupId: tagGroup.groupId,
          name: tagGroup.groupName,
        })),
      );
    }
  }, [tagData]);

  const handleUpdateAndVerify = (value: VerifyAudienceFormSchema) => {
    trigger({
      token: token,
      verifyAudienceRequest: {
        industryCode: value.industryCode,
        jobTypeCode: value.jobTypeCode,
        tags: selectedTags,
      },
    });
  };

  const handleSelectTag = (tag: ITag) => {
    let childTags: ITag[] = [];
    if (tag.groupId) {
      const groupIndex = tags.findIndex((item) => item.groupId === tag.groupId);
      childTags = tagData.data
        .find((group) => group.groupId === tag.groupId)
        .tags.map((item) => ({
          groupId: undefined,
          id: item.id,
          name: item.name,
        }));

      setTags((prev) => {
        const newTags = [...prev];
        newTags.splice(groupIndex, 1, ...childTags);
        return newTags;
      });
    }

    let selectedTagId = undefined;
    if (childTags.length > 0) {
      selectedTagId = childTags.find((item) => item.name === tag.name).id;
      setSelectedTags((prev) => [...prev, selectedTagId]);
    } else {
      selectedTagId = tag.id;
      setSelectedTags((prev) => {
        const isTagSelected = prev.includes(selectedTagId);
        if (isTagSelected) {
          return prev.filter((item) => item !== selectedTagId);
        } else {
          return [...prev, selectedTagId];
        }
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateAndVerify)}
        className={clsx('flex items-center justify-center flex-col')}
      >
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
        <div className={clsx(styles.between, 'flex-wrap gap-20 mt-8')}>
          <div>
            <div className='mb-6 block'>
              <FormCustomLabel
                htmlFor='jobTypeCode'
                label='jobTypeCode'
                className='text-md mb-1 font-medium flex items-center justify-center'
              />
              <h4 className='font-light opacity-80 text-sm'>
                Explore Opportunities Tailored to Your Profession and <br />
                Discover Career Paths Suited to Your Skillset.
              </h4>
            </div>
            <FormCombobox
              options={optionify(JobTypeCode)}
              i18nPath='code.jobType'
              name='jobTypeCode'
              control={form.control}
              title='type job'
              multiple={false}
              className='w-full'
            />
          </div>

          <div>
            <div className='mb-6 block'>
              <FormCustomLabel
                htmlFor='industryCode'
                label='industryCode'
                className='text-md mb-1 font-medium flex items-center justify-center'
              />

              <h4 className='font-light opacity-80 text-sm'>
                Navigate Through Industry-Specific Insights and Unlock <br />
                the Latest Trends in Your Industry.
              </h4>
            </div>
            <FormCombobox
              options={optionify(IndustryCode)}
              i18nPath='code.industry'
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
            {tags.length > 0 &&
              tags.map((tag: ITag) => (
                <Tag
                  tag={tag}
                  key={tag.groupId ? `group-${tag.groupId}` : `tag-${tag.id}`}
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
