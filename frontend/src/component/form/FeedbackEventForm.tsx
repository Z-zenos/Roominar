'use client';

import {
  useFeedbackEventMutation,
  useListingFeedbackCriteriaQuery,
  useListingFeedbacksQuery,
} from '@/src/api/feedback.api';
import Button from '@/src/component/common/Button/Button';
import { Card, CardContent } from '@/src/component/common/Card/Card';
import { Textarea } from '@/src/component/common/Input/Textarea';
import { Label } from '@/src/component/common/Label';
import { RadioGroup, RadioGroupItem } from '@/src/component/common/RadioGroup';
import { handleApiError } from '@/src/utils/app.util';
import { Switch } from '@nextui-org/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

type FeedbackEventFormProps = {
  eventId: number;
};

export default function FeedbackEventForm({ eventId }: FeedbackEventFormProps) {
  const [positiveFeedback, setPositiveFeedback] = useState('');
  const [negativeFeedback, setNegativeFeedback] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>({});

  const { data: criteriaList } = useListingFeedbackCriteriaQuery({
    eventId,
  });

  const { refetch: refetchListingFeedbacks } = useListingFeedbacksQuery(
    {
      eventId,
    },
    false,
  );

  const { trigger: submitFeedback, isMutating } = useFeedbackEventMutation({
    onSuccess: () => {
      toast.success('Cảm ơn bạn đã gửi feedback!');
      refetchListingFeedbacks();
    },
    onError: handleApiError,
  });

  const handleScoreChange = (criteriaId: number, score: number) => {
    setScores((prev) => ({ ...prev, [criteriaId]: score }));
  };

  const handleSubmit = async () => {
    await submitFeedback({
      eventId,
      feedbackEventRequest: {
        positiveFeedback: positiveFeedback || null,
        negativeFeedback: negativeFeedback || null,
        isAnonymous: isAnonymous,
        ratings: criteriaList?.data.map((c) => ({
          criteriaId: c.id,
          score: scores[c.id],
        })),
      },
    });
  };

  return (
    <Card className='w-full mx-auto p-4 pb-0 shadow-xl rounded-2xl'>
      <CardContent className='space-y-6'>
        <div>
          <Label>Positive Feedback</Label>
          <Textarea
            placeholder='Bạn thích điều gì?'
            value={positiveFeedback}
            onChange={(e) => setPositiveFeedback(e.target.value)}
          />
        </div>

        <div>
          <Label>Negative Feedback</Label>
          <Textarea
            placeholder='Chúng tôi có thể cải thiện điều gì?'
            value={negativeFeedback}
            onChange={(e) => setNegativeFeedback(e.target.value)}
          />
        </div>

        <div className='space-y-4'>
          {criteriaList?.data.map((criteria) => (
            <div
              key={criteria.id}
              className='space-y-1'
            >
              <Label className='block mb-2'>{criteria.name}</Label>
              <RadioGroup
                value={String(scores[criteria.id] || '')}
                onValueChange={(val) =>
                  handleScoreChange(criteria.id, Number(val))
                }
                className='flex gap-4'
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div
                    key={value}
                    className='flex items-center space-x-2'
                  >
                    <RadioGroupItem
                      value={String(value)}
                      id={`${criteria.id}-${value}`}
                    />
                    <Label htmlFor={`${criteria.id}-${value}`}>{value}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className='flex items-center gap-2'>
          <Switch
            id='anonymous'
            checked={isAnonymous}
            onValueChange={setIsAnonymous}
          />
          <Label htmlFor='anonymous'>Gửi ẩn danh</Label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isMutating}
          isLoading={isMutating}
        >
          {isMutating ? 'Đang gửi...' : 'Gửi feedback'}
        </Button>
      </CardContent>
    </Card>
  );
}
