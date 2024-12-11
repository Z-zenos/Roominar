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
  ErrorResponse400,
} from '@/src/lib/api/generated';
import toast from 'react-hot-toast';

// Make sure to call 'loadStripe' outside of a component's render to avoid
// recreating the 'Stripe' object on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

interface ApplicationCheckoutProps {
  eventId: number;
  tickets: ApplicationTicket[];
}

export default function ApplicationCheckout({
  eventId,
  tickets,
}: ApplicationCheckoutProps) {
  console.log(stripePromise);
  const [clientSecret, setClientSecret] = useState('');

  const { trigger } = useCreateApplicationCheckoutSessionMutation({
    onSuccess(data) {
      setClientSecret(data.clientSecret);
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  useEffect(() => {
    trigger({
      eventId,
      createApplicationCheckoutSessionRequest: {
        tickets,
      },
    });
  }, [trigger, JSON.stringify(tickets), eventId]);

  const options = { clientSecret };

  return (
    <div id='checkout'>
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}
