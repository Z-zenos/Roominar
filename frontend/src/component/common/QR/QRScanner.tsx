// components/QRScanner.tsx
'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

import './QRScanner.css'; // Ensure you have the CSS for styling

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
        scanner.clear(); // Stop scanning once found
        onScanSuccess(decodedText);
      },
      (error) => {
        console.log('Scan error', error);
      },
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScanSuccess]);

  return (
    <div
      id='qr-reader'
      className='w-full'
    />
  );
}
