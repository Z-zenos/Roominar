'use client';

import { useVerifyAudienceMutation } from '@/src/api/auth.api';
import { handleApiError } from '@/src/utils/app.util';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface VerifyOrganizationProps {
  token: string;
}

function VerifyOrganization({ token }: VerifyOrganizationProps) {
  const router = useRouter();

  const { trigger } = useVerifyAudienceMutation({
    onSuccess() {
      router.push('/organization/login');
    },
    onError: handleApiError,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      trigger({
        token: token,
        verifyAudienceRequest: {
          industryCode: undefined,
          jobTypeCode: undefined,
          tags: [],
        },
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [token, trigger]);

  return (
    <p className='mt-4 mb-8 font-light text-gray-700 text-nm'>
      This organization has passed our verification process 🔍 and is recognized
      as a trusted partner 🤝. You can now create events and webinars.
    </p>
  );
}

export default VerifyOrganization;
