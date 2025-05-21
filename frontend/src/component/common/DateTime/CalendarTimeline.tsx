'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import type {
  CalendarOptions,
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventDropArg,
} from '@fullcalendar/core';

import './Calendar.css';
import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import dayjs from '@/src/utils/dayjs';
import { TimePickerInput } from './TimePicker';

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
  onTimeChange?: ({
    title,
    from,
    to,
  }: {
    title: string;
    from: Date;
    to: Date;
  }) => void;
  fromTime?: Date | undefined;
  toTime?: Date | undefined;
  onTimeSettingTypeChange?: (type: 'APPLICATION_TIME' | 'EVENT_TIME') => void;
}

export default function CalendarTimeline({
  onSelectDate,
  onChange,
  events,
  id,
  name,
  height = 600,
  aspectRatio = 1,
  onTimeChange,
  fromTime: fTime,
  toTime: tTime,
  onTimeSettingTypeChange,
  ...props
}: CalendarTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(
    null,
  );
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const fromHourRef = useRef<HTMLInputElement>(null);
  const fromMinuteRef = useRef<HTMLInputElement>(null);
  const toHourRef = useRef<HTMLInputElement>(null);
  const toMinuteRef = useRef<HTMLInputElement>(null);
  const [fromTime, setFromTime] = useState<Date | undefined>(fTime);
  const [toTime, setToTime] = useState<Date | undefined>(tTime);

  useEffect(() => {
    if (fTime) setFromTime(fTime);
    if (tTime) setToTime(tTime);
  }, [fTime, tTime]);

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

  const showPopoverForEvent = (
    arg: EventClickArg | EventDropArg | EventResizeDoneArg,
  ) => {
    const rect = arg.el.getBoundingClientRect();

    setPopoverPosition({
      top: rect.bottom,
      left: rect.left + rect.width / 2,
    });

    setSelectedEvent(arg);
    setIsPopoverOpen(true);

    setFromTime(fTime);
    setToTime(tTime);
  };

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
          if (
            arg.event.title === 'Application time' ||
            arg.event.title === 'Event time'
          ) {
            if (arg.event.title === 'Application time') {
              onTimeSettingTypeChange?.('APPLICATION_TIME');
            } else if (arg.event.title === 'Event time') {
              onTimeSettingTypeChange?.('EVENT_TIME');
            }
            showPopoverForEvent(arg);
          }
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
            top: `${popoverPosition.top / 2}px`,
            left: `${popoverPosition.left / 2}px`,
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
            <PopoverContent className='w-[320px] shadcn-popover-content rounded-xl shadow-lg'>
              <div className='p-2'>
                <h3 className='font-medium'>{selectedEvent?.event?.title}</h3>
                <div className='flex items-center justify-between mt-2 font-light'>
                  From {dayjs(selectedEvent?.event?.start).format('YYYY-MM-DD')}{' '}
                  <div className='flex items-center justify-end gap-2'>
                    <TimePickerInput
                      picker='hours'
                      date={fromTime}
                      setDate={(date) => {
                        setFromTime(date);
                        onTimeChange?.({
                          title: selectedEvent?.event?.title || '',
                          from: dayjs(selectedEvent?.event?.start)
                            .hour(dayjs(date).hour())
                            .minute(dayjs(date).minute())
                            .second(dayjs(date).second())
                            .millisecond(dayjs(date).millisecond())
                            .toDate(),
                          to: undefined,
                        });
                      }}
                      ref={fromHourRef}
                      onRightFocus={() => fromMinuteRef.current?.focus()}
                    />
                    <TimePickerInput
                      picker='minutes'
                      date={fromTime}
                      setDate={(date) => {
                        setFromTime(date);
                        onTimeChange?.({
                          title: selectedEvent?.event?.title || '',
                          from: dayjs(selectedEvent?.event?.start)
                            .hour(dayjs(date).hour())
                            .minute(dayjs(date).minute())
                            .second(dayjs(date).second())
                            .millisecond(dayjs(date).millisecond())
                            .toDate(),
                          to: undefined,
                        });
                      }}
                      ref={fromMinuteRef}
                      onLeftFocus={() => fromHourRef.current?.focus()}
                      onRightFocus={() => toHourRef.current?.focus()}
                    />
                  </div>
                </div>
                <div className='flex items-center justify-between mt-2 font-light'>
                  To {dayjs(selectedEvent?.event?.end).format('YYYY-MM-DD')}{' '}
                  <div className='flex items-center justify-end gap-2'>
                    <TimePickerInput
                      picker='hours'
                      date={toTime}
                      setDate={(date) => {
                        setToTime(date);
                        onTimeChange?.({
                          title: selectedEvent?.event?.title || '',
                          from: undefined,
                          to: dayjs(selectedEvent?.event?.end)
                            .hour(dayjs(date).hour())
                            .minute(dayjs(date).minute())
                            .second(dayjs(date).second())
                            .millisecond(dayjs(date).millisecond())
                            .toDate(),
                        });
                      }}
                      ref={toHourRef}
                      onRightFocus={() => toMinuteRef.current?.focus()}
                    />
                    <TimePickerInput
                      picker='minutes'
                      date={toTime}
                      setDate={(date) => {
                        setToTime(date);
                        onTimeChange?.({
                          title: selectedEvent?.event?.title || '',
                          from: undefined,
                          to: dayjs(selectedEvent?.event?.end)
                            .hour(dayjs(date).hour())
                            .minute(dayjs(date).minute())
                            .second(dayjs(date).second())
                            .millisecond(dayjs(date).millisecond())
                            .toDate(),
                        });
                      }}
                      ref={toMinuteRef}
                      onLeftFocus={() => toHourRef.current?.focus()}
                    />
                  </div>
                </div>
                <div className='flex justify-between mt-4'>
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
