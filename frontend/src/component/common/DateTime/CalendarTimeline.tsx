'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import type { DateSelectArg } from '@fullcalendar/core';

interface CalendarTimelineEventItem {
  title: string;
  start: Date;
  end: Date;
  color: string;
}

interface CalendarTimelineProps {
  onSelectDate?: (timelineObject: DateSelectArg) => void;
  events?: CalendarTimelineEventItem[];
}

export default function CalendarTimeline({
  onSelectDate,
  events,
}: CalendarTimelineProps) {
  return (
    <div className='calendar-container mt-2'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        nowIndicator={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        height={600}
        aspectRatio={1}
        initialEvents={events && events.filter((event) => Boolean(event.start))}
        select={onSelectDate}
      />
    </div>
  );
}
