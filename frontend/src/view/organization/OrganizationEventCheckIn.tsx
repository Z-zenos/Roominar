// app/checkin/page.tsx
'use client';

import { useQRChecInMutation } from '@/src/api/event.api';
import QRScanner from '@/src/component/common/QR/QRScanner';
import type { ApiException, ErrorResponse400 } from '@/src/lib/api/generated';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AttendeeCheckInTable from '../attendee/AttendeeCheckInTable';
import { useRouter } from 'next/navigation';

export default function OrganizationEventCheckIn() {
  const router = useRouter();
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
      setMessage('Không tìm thấy mã QR. Vui lòng thử  lại.');
      return;
    }

    const data = JSON.parse(qrCode);

    qrCheckIn({
      eventId: data.eventId,
      qRCheckInRequest: {
        qrCodeId: data.qrCodeId,
        eventId: data.eventId,
        userId: auth.user.id,
        checksum: data.checksum,
      },
    });
    router.refresh();
  }

  return (
    <div className='grid 1200px:grid-cols-2 grid-cols-1 gap-4'>
      <div>
        <h1 className='text-lg font-bold mb-4'>Quét mã QR</h1>
        <QRScanner onScanSuccess={handleScanQR} />
        <p className='mt-4 text-center text-lg'>{message}</p>
      </div>

      <div className='1200px:mt-0 mt-7'>
        <h1 className='text-lg font-bold mb-4'>Check-in thủ công</h1>

        <AttendeeCheckInTable />
      </div>
    </div>
  );
}
