import { useEffect, useState } from 'react';
import { TransactionStatusCode } from '../lib/api/generated';

export function usePaymentStatus() {
  const [status, setStatus] = useState<TransactionStatusCode | null>(null);

  useEffect(() => {
    const paymentSessionToken = sessionStorage.getItem('paymentSessionToken');
    if (!paymentSessionToken) {
      return;
    }

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WSS_URL}/payment/${paymentSessionToken}`,
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.status);

      if (
        [TransactionStatusCode.Success, TransactionStatusCode.Failed].includes(
          data.status,
        )
      ) {
        ws.close();
      }
    };

    ws.onerror = () => {
      console.error('WebSocket error');
    };

    return () => ws.close();
  }, []);

  return status;
}
