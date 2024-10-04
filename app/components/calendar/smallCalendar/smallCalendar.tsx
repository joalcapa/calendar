'use client'

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { es } from 'date-fns/locale';
import SmallCalendarServer from "@/app/components/calendar/smallCalendar/smallCaldendarServer";
import { useRouter, useSearchParams } from "next/navigation";
const DATE_FORMAT = 'yyyy-MM-dd';

const SmallCalendar = ({ date }) => {
  const [currentMonth, setCurrentMonth] = useState(date);
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', format(currentMonth , DATE_FORMAT));
    replace(`?${params.toString()}`);
  }, [ currentMonth ]);

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          &#8249;
        </button>
        <span className="text-lg font-medium">{format(currentMonth, "MMMM yyyy", { locale: es }).charAt(0).toUpperCase() + format(currentMonth, "MMMM yyyy", { locale: es }).slice(1)}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          &#8250;
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 }); // Cambiar para iniciar en domingo
    for (let i = 0; i < 7; i++) {
      const dayName = format(addDays(startDate, i), "EEE", { locale: es });
      days.push(
        <div key={i} className="text-center font-medium">
          {dayName.charAt(0).toUpperCase()} {/* Solo la primera letra en mayúscula */}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Cambiar para iniciar en domingo
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Cambiar para iniciar en domingo

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={day}
            className={`p-2 text-center border ${isSameMonth(day, monthStart) ? "" : "text-gray-400"} 
            ${
              isSameDay(day, new Date()) ? 
                  "bg-orange-500 hover:bg-orange-200 text-white" : 
                  isSameDay(day, currentMonth) ? 
                      "bg-blue-500 hover:bg-blue-200 text-white" : ""
            }
            cursor-pointer`}
            onClick={() => setCurrentMonth(cloneDay)}
          >
            {format(day, "d", { locale: es })}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white p-4 rounded w-64">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}

export default ({ date }: { date: Date }) => {
  const [ isMount, setMount ] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setMount(true);
    }

    return () => {
      isMounted = false;
    }
  }, []);

  return isMount ? <SmallCalendar date={date} /> : <SmallCalendarServer date={date} />;
}