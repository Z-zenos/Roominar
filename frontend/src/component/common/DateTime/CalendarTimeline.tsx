'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import type { DateSelectArg, EventChangeArg } from '@fullcalendar/core';

interface CalendarTimelineEventItem {
  title: string;
  start: Date;
  end: Date;
  color: string;
}

interface CalendarTimelineProps {
  onSelectDate?: (timelineObject: DateSelectArg) => void;
  onChange?: (event: EventChangeArg) => void;
  events?: CalendarTimelineEventItem[];
  id?: string;
  name?: string;
}

export default function CalendarTimeline({
  onSelectDate,
  onChange,
  events,
  id,
  name,
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
        events={events && events.filter((event) => event.start && event.end)}
        // initialEvents={[
        //   {
        //     title: 'Application start',
        //     start: new Date('2024-12-30T17:00:00.000Z'),
        //     end: new Date('2025-01-01T17:00:00.000Z'),
        //     color: '#FFD700',
        //   },
        // ]}
        select={onSelectDate}
        eventChange={onChange}
      />
      <input
        type='date'
        id={id}
        name={name}
        className='opacity-0'
      />
    </div>
  );
}
