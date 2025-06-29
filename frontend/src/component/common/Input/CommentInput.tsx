'use client';

import type { CommentEventRequestSchema } from '@/src/schemas/event/CommentEventFormSchema';
import { Form, FormTextarea } from '../../form/Form';
import { Button } from '@nextui-org/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentEventRequestSchema } from '@/src/schemas/event/CommentEventFormSchema';
import { useSession } from 'next-auth/react';

interface CommentInputProps {
  onSubmit: (data: CommentEventRequestSchema) => void;
  isLoading: boolean;
  defaultContent?: string;
  isUpdate?: boolean;
  onCancel?: () => void;
}

export default function CommentInput({
  onSubmit,
  isLoading,
  defaultContent = '',
  isUpdate = false,
  onCancel,
}: CommentInputProps) {
  const { status } = useSession();
  const form = useForm<CommentEventRequestSchema>({
    resolver: zodResolver(commentEventRequestSchema),
    defaultValues: {
      content: defaultContent,
    },
  });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <div className=' bg-White  rounded-lg flex flex-col space-y-3'>
          <FormTextarea
            id='content'
            name='content'
            placeholder='Viết bình luận...'
            control={form.control}
            showError={true}
            rows={5}
            className='w-full'
          />

          <div className='flex justify-end py-2'>
            {isUpdate && (
              <Button
                color='default'
                radius='sm'
                type='button'
                className='mr-2'
                onClick={onCancel}
              >
                Hủy bỏ
              </Button>
            )}
            <Button
              color='primary'
              isLoading={isLoading}
              radius='sm'
              className='float-end'
              isDisabled={status !== 'authenticated' || isLoading}
              type='submit'
            >
              {isLoading ? 'Đang gửi...' : isUpdate ? 'Cập nhật' : 'Bình luận'}
            </Button>
          </div>
        </div>
      </Form>
    </form>
  );
}
