import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getToken, onMessage, isSupported } from '@/src/lib/firebase/client';
import { useRegisterNotificationDeviceTokenMutation } from '@/src/api/notification.api';
import { DeviceTypeCode } from '../lib/api/generated';
import toast from 'react-hot-toast';

// Store FCM token in localStorage for persistence across sessions
const FCM_TOKEN_KEY = 'fcm_token';

export function useNotification() {
  const { status } = useSession();
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  const { trigger: registerToken } =
    useRegisterNotificationDeviceTokenMutation();

  // Setup notifications and register token
  useEffect(() => {
    if (status !== 'authenticated') return;

    const setupNotifications = async () => {
      try {
        // Check if FCM is supported in this browser
        if (!(await isSupported())) {
          console.log('Firebase messaging not supported in this browser');
          return;
        }

        // Check if we have permission already
        const currentPermission = Notification.permission;
        setPermission(currentPermission);

        if (currentPermission === 'granted') {
          // Register service worker if needed
          let swRegistration = undefined;
          if ('serviceWorker' in navigator) {
            swRegistration = await navigator.serviceWorker.register(
              '/firebase-messaging-sw.js',
            );
          }

          // Get FCM token and register it with backend
          const token = await getToken(swRegistration);
          if (token) {
            // Save token to state and localStorage
            setFcmToken(token);
            localStorage.setItem(FCM_TOKEN_KEY, token);

            // Register token with backend
            await registerToken({
              registerNotificationDeviceTokenRequest: {
                fcmToken: token,
                deviceType: DeviceTypeCode.Web,
              },
            });

            // Set up foreground message handler
            onMessage((payload) => {
              toast(
                <div className='flex flex-col'>
                  <span className='font-semibold'>
                    {payload.notification?.title}
                  </span>
                  <span>{payload.notification?.body}</span>
                </div>,
                { icon: '🔔', duration: 6000 },
              );
            });
          }
        }
      } catch {}
    };

    setupNotifications();
  }, [registerToken, status]);

  // Request permission function
  const requestPermission = async () => {
    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      // If permission granted, set up notifications
      if (permissionResult === 'granted') {
        let swRegistration = undefined;
        if ('serviceWorker' in navigator) {
          swRegistration = await navigator.serviceWorker.register(
            '/firebase-messaging-sw.js',
          );
        }

        const token = await getToken(swRegistration);
        if (token) {
          setFcmToken(token);
          localStorage.setItem(FCM_TOKEN_KEY, token);

          await registerToken({
            registerNotificationDeviceTokenRequest: {
              fcmToken: token,
              deviceType: DeviceTypeCode.Web,
            },
          });
        }
      }
    } catch {}
  };

  return {
    notificationsEnabled: permission === 'granted',
    fcmToken,
    requestPermission,
  };
}

// Helper function to get stored FCM token
export function getStoredFcmToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(FCM_TOKEN_KEY);
}
