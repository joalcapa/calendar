'use client'

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { es } from 'date-fns/locale'; // Importa el locale en español

export default function SmallCalendar({ onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
            ${isSameDay(day, new Date()) ? "bg-blue-500 text-white" : ""}
            hover:bg-blue-200 cursor-pointer`}
            onClick={() => onSelectDate(cloneDay)}
          >
            {format(day, "d", { locale: es })} {/* Aplica el locale aquí */}
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