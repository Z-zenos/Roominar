'use client';

import DotLoader from '@/src/component/common/Loader/DotLoader';
import { useEffect, useState } from 'react';

export default function EventApplicationResult({ searchParams }) {
  const { session_id } = searchParams;
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (session_id) {
      fetch(`/api/verify-session?session_id=${session_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setStatus('success');
          else setStatus('failed');
        });
    }
  }, [session_id]);

  if (status === 'loading') return <DotLoader />;
  if (status === 'failed') return <p>Payment failed. Please try again.</p>;

  return <p>Thank you! Your payment was successful.</p>;
}
