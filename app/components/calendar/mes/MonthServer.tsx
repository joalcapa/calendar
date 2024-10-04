import React from 'react';
import { Day } from '../../../../types/month';

interface MonthProps {
    days: Day[];
    startDayOfMonth: number;
    monthName: string;
}

const Month: React.FC<MonthProps> = (
    {
        days,
        startDayOfMonth,
        monthName,
    }
) => (
    <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-xl font-semibold text-gray-800 pb-3">{monthName}</h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div className="font-bold flex items-center justify-center" key={day}>
                    {day}
                </div>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
            {Array.from({length: startDayOfMonth}, (_, index) => (
                <div key={`empty-${index}`} className="flex items-center justify-center">
                    <div
                        className="relative flex flex-col items-start justify-start border border-gray-300 h-32 w-32 bg-gray-200"></div>
                </div>
            ))}
            {days.map((day, index) => (
                <div key={index} className="flex items-center justify-center">
                    <div
                        className={`relative flex flex-col items-start justify-start border h-32 w-32 p-1 overflow-hidden cursor-pointer ${day.isCurrentMonth
                            ? (day.isToday ? 'border-2 border-yellow-600 shadow-lg' : day.isCurrent ? 'border-2 border-blue-600 shadow-lg' : 'bg-white hover:bg-gray-100')
                            : 'bg-gray-200 opacity-50'
                        }`}
                    >
            <span className="absolute top-1 left-1 text-xs font-bold">
              {day.day} {day.isToday ? '- HOY' : ''}
            </span>
                        <div className="mt-5 w-full h-full overflow-hidden">
                            {day.events.map((event, eventIndex) => (
                                <div
                                    key={eventIndex}
                                    className="text-xs text-left truncate bg-blue-100 p-1 mb-1 rounded max-w-full whitespace-nowrap overflow-hidden"
                                    style={{maxWidth: '100%', maxHeight: '20px', paddingBottom: 20}}
                                >
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
            {Array.from({length: startDayOfMonth + days.length % 7 === 0 ? 0 : 7 - (startDayOfMonth + days.length % 7)}, (_, index) => (
                <div key={`empty-end-${index}`} className="flex items-center justify-center">
                    <div
                        className="relative flex flex-col items-start justify-start border border-gray-300 h-32 w-32 bg-gray-200"></div>
                </div>
            ))}
        </div>
    </div>
);

export default Month;