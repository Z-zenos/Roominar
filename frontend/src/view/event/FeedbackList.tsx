'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/src/component/common/Card/Card';
import { Star } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/component/common/Avatar';
import { Separator } from '@/src/component/common/Separator';
import { Button } from '@/src/component/common/Button/ShardButton';

const initialFeedbacks = [
  {
    id: 1,
    user: {
      name: 'Nguyễn Văn A',
      avatar_url: 'https://i.pravatar.cc/150?u=123',
    },
    is_anonymous: false,
    positive_feedback: 'Sự kiện tổ chức rất chuyên nghiệp!',
    negative_feedback: 'Âm thanh hơi nhỏ.',
    scores: [
      { criteria_id: 1, criteria_name: 'Nội dung', score: 5 },
      { criteria_id: 2, criteria_name: 'Diễn giả', score: 4 },
    ],
  },
];

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    // Simulate loading more
    const more = [
      {
        id: 2,
        user: null,
        is_anonymous: true,
        positive_feedback: 'Mình rất thích phần hỏi đáp.',
        negative_feedback: null,
        scores: [
          { criteria_id: 1, criteria_name: 'Nội dung', score: 4 },
          { criteria_id: 2, criteria_name: 'Diễn giả', score: 5 },
        ],
      },
    ];
    setFeedbacks((prev) => [...prev, ...more]);
    setHasMore(false); // giả định hết dữ liệu
  };

  return (
    <div className='grid 800px:grid-cols-2 grid-cols-1 w-full gap-3 mt-4 mb-12 items-start'>
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
                  src={
                    feedback.is_anonymous
                      ? undefined
                      : feedback.user?.avatar_url
                  }
                  alt={feedback.is_anonymous ? 'Ẩn danh' : feedback.user?.name}
                />
                <AvatarFallback>
                  {feedback.is_anonymous
                    ? 'Ẩ'
                    : feedback.user?.name?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold text-base'>
                  {feedback.is_anonymous
                    ? 'Người dùng ẩn danh'
                    : feedback.user?.name}
                </p>
              </div>
            </div>

            {/* Scores */}
            <div className='space-y-1'>
              {feedback.scores.map((score) => (
                <div
                  key={score.criteria_id}
                  className='flex justify-between items-center'
                >
                  <span className='text-sm text-muted-foreground'>
                    {score.criteria_name}
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
            {feedback.positive_feedback && (
              <div>
                <p className='text-sm font-semibold text-green-700 mb-1'>
                  Điểm tích cực:
                </p>
                <p className='text-sm text-gray-700'>
                  {feedback.positive_feedback}
                </p>
              </div>
            )}

            {/* Negative Feedback */}
            {feedback.negative_feedback && (
              <div>
                <p className='text-sm font-semibold text-red-700 mb-1'>
                  Điểm cần cải thiện:
                </p>
                <p className='text-sm text-gray-700'>
                  {feedback.negative_feedback}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div className='flex justify-center'>
          <Button
            variant='outline'
            onClick={loadMore}
          >
            Xem thêm
          </Button>
        </div>
      )}
    </div>
  );
}
