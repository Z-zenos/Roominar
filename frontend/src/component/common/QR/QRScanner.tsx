// components/QRScanner.tsx
'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

import './QRScanner.css'; // Ensure you have the CSS for styling
import { Html5QrcodeTranslate } from '@/src/hooks/useHTML5QRCodeTranslation';

export default function QRScanner({
  onScanSuccess,
}: {
  onScanSuccess: (data: string) => void;
}) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: 250,
      },
      false,
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScanSuccess(decodedText);
      },
      (error) => {
        console.warn('Lỗi quét mã:', error);
      },
    );

    const translator = new Html5QrcodeTranslate('#qr-reader');

    return () => {
      scanner.clear().catch(console.error);
      translator.disconnect();
    };
  }, [onScanSuccess]);

  return (
    <div
      id='qr-reader'
      className='w-full'
    />
  );
}
