'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';

type RightSidebarContentType =
  | 'ATTENDEE_DETAIL'
  | 'TARGET'
  | 'NOTIFICATION_LIST'
  | null;

type RightSidebarState = {
  contentType: RightSidebarContentType;
  selectedAttendeeId: number | null;
};

type RightSidebarContextType = {
  state: RightSidebarState;
  open: (
    contentType: RightSidebarContentType,
    selectedAttendeeId?: number,
  ) => void;
  close: () => void;
  isOpen: boolean;
  refetch: () => void;
};

const RightSidebarContext = createContext<RightSidebarContextType | undefined>(
  undefined,
);

export const RightSidebarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<RightSidebarState>({
    contentType: null,
    selectedAttendeeId: null,
  });

  const open = useCallback(
    (contentType: RightSidebarContentType, selectedAttendeeId?: number) => {
      setState({ contentType, selectedAttendeeId: selectedAttendeeId ?? null });
    },
    [],
  );

  const close = useCallback(() => {
    setState({ contentType: null, selectedAttendeeId: null });
  }, []);

  const isOpen = useMemo(() => !!state.contentType, [state.contentType]);
  const refetch = useCallback(() => {}, []);

  const value = useMemo(
    () => ({ state, open, close, isOpen, refetch }),
    [state, open, close, isOpen, refetch],
  );

  return (
    <RightSidebarContext.Provider value={value}>
      {children}
    </RightSidebarContext.Provider>
  );
};

export const useRightSidebar = () => {
  const context = useContext(RightSidebarContext);
  if (!context)
    throw new Error('useRightSidebar must be used within RightSidebarProvider');
  return context;
};
