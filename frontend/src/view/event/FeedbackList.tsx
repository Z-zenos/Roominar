'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/src/component/common/Card/Card';
import { Star } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/component/common/Avatar';
import { Separator } from '@/src/component/common/Separator';
import { useListingFeedbacksQuery } from '@/src/api/feedback.api';
import type { ListingFeedbacksItem } from '@/src/lib/api/generated';
import Spinner from '@/src/component/common/Loader/Spinner';
import { Button } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function FeedbackList({ eventId }: { eventId: number }) {
  const [feedbacks, setFeedbacks] = useState<ListingFeedbacksItem[]>([]);
  const pathname = usePathname();

  const {
    data: feedbacksData,
    isLoading: isLoadingFeedbacks,
    isFetching: isFetchingFeedbacks,
    refetch: refetchFeedbacks,
  } = useListingFeedbacksQuery({
    eventId,
  });

  useEffect(() => {
    if (feedbacksData) {
      setFeedbacks((prev) => [...prev, ...feedbacksData.data]);
    }
  }, [feedbacksData]);

  if (isLoadingFeedbacks) {
    return <Spinner />;
  }

  return (
    <div
      className={clsx(
        'grid w-full gap-3 mt-4 mb-12 items-start grid-cols-1',
        pathname.includes('organization')
          ? '800px:grid-cols-3 450px:grid-cols-2'
          : '800px:grid-cols-2',
      )}
    >
      {feedbacks.map((feedback) => (
        <Card
          key={feedback.id}
          className='rounded-2xl shadow-md col-span-1 h-full'
        >
          <CardContent className='p-6 space-y-4'>
            {/* User Info */}
            <div className='flex items-center gap-4'>
              <Avatar>
                <AvatarImage
                  src={feedback.isAnonymous ? undefined : feedback.userAvatar}
                  alt={feedback.isAnonymous ? 'Ẩn danh' : feedback.userName}
                />
                <AvatarFallback>
                  {feedback.isAnonymous
                    ? 'Ẩ'
                    : feedback.userName?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold text-base'>
                  {feedback.isAnonymous
                    ? 'Người dùng ẩn danh'
                    : feedback.userName}
                </p>
              </div>
            </div>

            {/* Scores */}
            <div className='space-y-1'>
              {feedback?.ratings.map((score) => (
                <div
                  key={score.criteriaId}
                  className='flex justify-between items-center'
                >
                  <span className='text-sm text-muted-foreground'>
                    {score.criteriaName}
                  </span>
                  <div className='flex items-center gap-1'>
                    {[...Array(score.score)].map((_, i) => (
                      <Star
                        key={i}
                        className='h-4 w-4 fill-yellow-400 text-yellow-500'
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Positive Feedback */}
            {feedback.positiveFeedback && (
              <div>
                <p className='text-sm font-semibold text-green-700 mb-1'>
                  Điểm tích cực:
                </p>
                <p className='text-sm text-gray-700'>
                  {feedback.positiveFeedback}
                </p>
              </div>
            )}

            {/* Negative Feedback */}
            {feedback.negativeFeedback && (
              <div>
                <p className='text-sm font-semibold text-red-700 mb-1'>
                  Điểm cần cải thiện:
                </p>
                <p className='text-sm text-gray-700'>
                  {feedback.negativeFeedback}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {feedbacksData?.total == 10 && (
        <div className='flex justify-center col-span-2'>
          <Button
            onClick={() => refetchFeedbacks()}
            isLoading={isFetchingFeedbacks}
          >
            Xem thêm
          </Button>
        </div>
      )}
    </div>
  );
}
