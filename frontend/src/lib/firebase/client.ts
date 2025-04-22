import type {
  MessagePayload,
  Messaging,
  NextFn,
  Observer,
  Unsubscribe,
} from 'firebase/messaging';
import {
  getToken as fcmGetToken,
  onMessage as fcmOnMessage,
  getMessaging,
} from 'firebase/messaging';

export { isSupported } from 'firebase/messaging';

export async function messaging(): Promise<Messaging> {
  const { app } = await import('@/src/lib/firebase/app');

  return getMessaging(app);
}

export async function onMessage(
  handler: NextFn<MessagePayload> | Observer<MessagePayload>,
): Promise<Unsubscribe> {
  return fcmOnMessage(await messaging(), handler);
}

export async function getToken(
  serviceWorkerRegistration?: ServiceWorkerRegistration,
): Promise<string> {
  return fcmGetToken(await messaging(), {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
    serviceWorkerRegistration,
  });
}
