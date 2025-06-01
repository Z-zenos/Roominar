// app/checkin/page.tsx
'use client';

import { useQRChecInMutation } from '@/src/api/event.api';
import QRScanner from '@/src/component/common/QR/QRScanner';
import type {
  ApiException,
  ErrorResponse400,
  QRCheckInRequest,
} from '@/src/lib/api/generated';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function OrganizationEventCheckIn() {
  const [message, setMessage] = useState('');
  const { data: auth } = useSession();

  const { trigger: qrCheckIn } = useQRChecInMutation({
    onSuccess: () => {
      toast.success('✅ Check-in successfully!');
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  function handleScanQR(qrCode: string) {
    if (!qrCode) {
      setMessage('QR not found. Please try again.');
      return;
    }

    const data = JSON.parse(qrCode) as QRCheckInRequest;

    qrCheckIn({
      eventId: data.eventId,
      qRCheckInRequest: {
        qrCodeId: data.qrCodeId,
        eventId: data.eventId,
        userId: auth.user.id,
        checksum: data.checksum,
      },
    });
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Scan QR for check-in</h1>
      <QRScanner onScanSuccess={handleScanQR} />
      <p className='mt-4 text-center text-lg'>{message}</p>
    </div>
  );
}
