'use client';

import { NotificationList } from '@/src/component/common/Notification';
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from '@/src/component/common/Sheet';
import { useRightSidebar } from '@/src/contexts/RightSidebarContext';

import AttendeeDetail from '@/src/view/attendee/AttendeeDetail';
import { useMemo } from 'react';

interface OrganizationRightSidebarProps {
  refetch?: () => void;
}

export default function OrganizationRightSidebar({
  refetch,
}: OrganizationRightSidebarProps) {
  const { state, close } = useRightSidebar();

  const rightSidebar = useMemo(() => {
    switch (state.contentType) {
      case 'ATTENDEE_DETAIL':
        return {
          title: 'Thông tin người tham gia',
          body: <AttendeeDetail id={state.selectedAttendeeId} />,
          footer: null,
          className: 'min-w-[600px]',
        };
      case 'NOTIFICATION_LIST':
        return {
          title: 'Thông báo',
          body: (
            <NotificationList
              onRefetch={refetch}
              onClose={close}
            />
          ),
          footer: null,
          className: 'min-w-[400px]',
        };
      default:
        return null;
    }
  }, [state.contentType, state.selectedAttendeeId, close, refetch]);

  return (
    <SheetOverlay>
      <SheetContent
        side='right'
        className={rightSidebar?.className}
      >
        <SheetHeader>
          <SheetTitle className='text-primary'>
            {rightSidebar?.title}
          </SheetTitle>
          <SheetDescription />
          {rightSidebar?.body}
        </SheetHeader>
      </SheetContent>
    </SheetOverlay>
  );
}
