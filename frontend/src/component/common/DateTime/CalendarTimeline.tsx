'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import type {
  CalendarOptions,
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
} from '@fullcalendar/core';

import './Calendar.css';
import { useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';

interface CalendarTimelineEventItem {
  title: string;
  start: Date;
  end: Date;
  color: string;
  textColor?: string;
}

interface CalendarTimelineProps extends CalendarOptions {
  onSelectDate?: (timelineObject: DateSelectArg) => void;
  onChange?: (event: EventChangeArg) => void;
  events?: CalendarTimelineEventItem[];
  id?: string;
  name?: string;
  height?: number;
  aspectRatio?: number;
}

export default function CalendarTimeline({
  onSelectDate,
  onChange,
  events,
  id,
  name,
  height = 600,
  aspectRatio = 1,
  ...props
}: CalendarTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className='calendar-container mt-2 relative'>
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
        height={height}
        aspectRatio={aspectRatio}
        events={
          events &&
          events
            .filter((event) => event.start && event.end)
            .map((event) => ({
              ...event,
              allDay: true, // Allow resize to work,
            }))
        }
        select={onSelectDate}
        eventChange={onChange}
        eventClick={(arg) => {
          setSelectedEvent(arg);
        }}
        {...props}
      />
      {id && (
        <input
          type='date'
          id={id}
          name={name}
          className='opacity-0'
        />
      )}

      <Popover
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            className='absolute top-0 left-0 opacity-0 pointer-events-none'
          >
            Open Popover
          </button>
        </PopoverTrigger>
        <PopoverContent className='w-64'>
          {selectedEvent && (
            <div>
              <h4 className='font-semibold'>{selectedEvent.event.title}</h4>
              <p className='text-sm text-muted-foreground'>
                {selectedEvent.event.start?.toLocaleString()} —{' '}
                {selectedEvent.event.end?.toLocaleString()}
              </p>
              <button
                onClick={() => setSelectedEvent(null)}
                className='mt-2 text-blue-600 hover:underline text-sm'
              >
                Close
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
