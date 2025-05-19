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
import { useEffect, useState } from 'react';
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
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isPopoverOpen &&
        !(event.target as Element)?.closest('.shadcn-popover-content')
      ) {
        setIsPopoverOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

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
          // Get the position of the event element
          const rect = arg.el.getBoundingClientRect();

          // Position the popover at the bottom of the event
          setPopoverPosition({
            top: rect.bottom,
            left: rect.left + rect.width / 2,
          });

          setSelectedEvent(arg);
          setIsPopoverOpen(true);
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
      {selectedEvent && (
        <div
          style={{
            position: 'absolute',
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
            zIndex: 50,
          }}
        >
          <Popover
            open={isPopoverOpen}
            onOpenChange={setIsPopoverOpen}
          >
            <PopoverTrigger>
              <span className='sr-only'>Open popover</span>
            </PopoverTrigger>
            <PopoverContent className='w-72 shadcn-popover-content'>
              <div className='p-2'>
                <h3 className='font-medium'>{selectedEvent.event.title}</h3>
                <p className='text-sm text-gray-500'>
                  {new Date(selectedEvent.event.start!).toLocaleString()} -{' '}
                  {new Date(selectedEvent.event.end!).toLocaleString()}
                </p>
                <div className='flex justify-between mt-2'>
                  <button
                    className='text-sm text-blue-500 hover:underline'
                    onClick={() => {
                      // Handle edit action
                      setIsPopoverOpen(false);
                    }}
                  >
                    Ok
                  </button>
                  <button
                    className='text-sm text-red-500 hover:underline'
                    onClick={() => {
                      // Handle delete action
                      setIsPopoverOpen(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
