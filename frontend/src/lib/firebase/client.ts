import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, isSupported } from 'firebase/messaging';
import { firebaseConfig } from './config';

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { app, getMessaging, isSupported };
