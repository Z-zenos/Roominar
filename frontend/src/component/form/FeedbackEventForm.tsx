'use client';

import { useFeedbackEventMutation } from '@/src/api/feedback.api';
import Button from '@/src/component/common/Button/Button';
import { Card, CardContent } from '@/src/component/common/Card/Card';
import { Textarea } from '@/src/component/common/Input/Textarea';
import { Label } from '@/src/component/common/Label';
import { RadioGroup, RadioGroupItem } from '@/src/component/common/RadioGroup';
import { Switch } from '@nextui-org/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

type FeedbackCriteria = {
  id: number;
  name: string;
};

type FeedbackEventFormProps = {
  eventId: number;
  criteriaList: FeedbackCriteria[];
};

export default function FeedbackEventForm({
  eventId,
  criteriaList,
}: FeedbackEventFormProps) {
  const [positiveFeedback, setPositiveFeedback] = useState('');
  const [negativeFeedback, setNegativeFeedback] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>({});

  const { trigger: submitFeedback, isMutating } = useFeedbackEventMutation({
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
    },
    onError: () => {
      toast.error('Submission error');
    },
  });

  const handleScoreChange = (criteriaId: number, score: number) => {
    setScores((prev) => ({ ...prev, [criteriaId]: score }));
  };

  const handleSubmit = async () => {
    if (criteriaList.some((c) => !scores[c.id])) {
      toast.error('Please rate all criteria');
      return;
    }

    await submitFeedback({
      eventId,
      feedbackEventRequest: {
        positiveFeedback: positiveFeedback || null,
        negativeFeedback: negativeFeedback || null,
        isAnonymous: isAnonymous,
        ratings: criteriaList.map((c) => ({
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
            placeholder='What did you like?'
            value={positiveFeedback}
            onChange={(e) => setPositiveFeedback(e.target.value)}
          />
        </div>

        <div>
          <Label>Negative Feedback</Label>
          <Textarea
            placeholder='What could be improved?'
            value={negativeFeedback}
            onChange={(e) => setNegativeFeedback(e.target.value)}
          />
        </div>

        <div className='space-y-4'>
          {criteriaList.map((criteria) => (
            <div
              key={criteria.id}
              className='space-y-1'
            >
              <Label className='block'>{criteria.name}</Label>
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
          <Label htmlFor='anonymous'>Submit anonymously</Label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isMutating}
          isLoading={isMutating}
        >
          {isMutating ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </CardContent>
    </Card>
  );
}
