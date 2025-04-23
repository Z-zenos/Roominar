import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { useNotification } from '@/src/hooks/useNotification';

type NotificationContextType = {
  notificationsEnabled: boolean;
  requestPermission: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType>({
  notificationsEnabled: false,
  requestPermission: async () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const notificationState = useNotification();

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
