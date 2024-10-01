'use client'

import React from 'react';
import { Event } from '@/types/event';
import { Day, MonthEvents } from '@/types/month';
import useMonth from './useMonth';
import MonthServer from './monthServer';

interface MonthProps {
  days: Day[];
  today: number;
  weekDays?: string[];
  isMount: boolean;
  onEvent: (event: Event) => void;
  onDay: (day: number) => void;
}

const Month: React.FC<MonthProps> = (
  {
    days,
    today,
    weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    isMount = false,
    onEvent = (event: Event) => { },
    onDay = (day: number) => { },
  }
) => (
  <>
    {
      isMount ? (
        <div className="max-w-3xl mx-auto text-center">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div className="font-bold flex items-center justify-center" key={day}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="flex items-center justify-center">
                <div
                  className={`relative flex flex-col items-start justify-start border border-gray-300 h-32 w-32 p-1 overflow-hidden cursor-pointer ${day.isCurrentMonth
                    ? (day.day === today ? 'border-2 border-blue-600 shadow-lg' : 'bg-white hover:bg-gray-100')
                    : 'opacity-50'
                    }`}
                  onClick={() => onDay(day.day)}
                >
                  <span className="absolute top-1 left-1 text-xs font-bold">
                    {day.day}
                  </span>
                  <div className="mt-5 w-full h-full overflow-hidden">
                    {day.events.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="text-xs text-left truncate bg-blue-100 p-1 mb-1 rounded max-w-full whitespace-nowrap overflow-hidden cursor-pointer"
                        style={{ maxWidth: '100%', maxHeight: '20px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEvent(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : <MonthServer days={days} today={today} />
    }
  </>
);

export default (props: MonthEvents) => {
  const hook = useMonth(props);
  return <Month {...hook} />
}
