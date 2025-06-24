'use client';

import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { useCreateApplicationCheckoutSessionMutation } from '@/src/api/application.api';
import type {
  ApiException,
  ApplicationTicket,
  IndustryCode,
  JobTypeCode,
  SurveyResponseResultItem,
} from '@/src/lib/api/generated';
import DotLoader from '../Loader/DotLoader';
import { handleApiError } from '@/src/utils/app.util';

// Make sure to call 'loadStripe' outside of a component's render to avoid
// recreating the 'Stripe' object on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

interface ApplicationCheckoutProps {
  eventId: number;
  tickets: ApplicationTicket[];
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  workplaceName: string;
  industryCode: IndustryCode;
  jobTypeCode: JobTypeCode;
  surveyResponseResults: SurveyResponseResultItem[];
  isAgreed: boolean;
}

interface ApplicationCheckoutProps {
  onClose?: () => void;
}

export default function ApplicationCheckout({
  onClose,
  ...props
}: ApplicationCheckoutProps) {
  const [clientSecret, setClientSecret] = useState('');

  const { trigger } = useCreateApplicationCheckoutSessionMutation({
    onSuccess(data) {
      setClientSecret(data.clientSecret);
    },
    onError(error: ApiException<unknown>) {
      handleApiError(error);
      onClose();
    },
  });

  useEffect(() => {
    trigger({
      createApplicationRequest: {
        eventId: props.eventId,
        tickets: props.tickets.filter((ticket) => ticket),
        firstName: props.firstName,
        lastName: props.lastName,
        email: props.email,
        phone: props.phone,
        workplaceName: props.workplaceName,
        industryCode: props.industryCode,
        jobTypeCode: props.jobTypeCode,
        surveyResponseResults: props.surveyResponseResults,
        isAgreed: props.isAgreed,
      },
    });
  }, [trigger, JSON.stringify(props)]);

  return (
    <div id='checkout'>
      {clientSecret ? (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout className='max-h-[600px] overflow-y-scroll' />
        </EmbeddedCheckoutProvider>
      ) : (
        <DotLoader />
      )}
    </div>
  );
}
