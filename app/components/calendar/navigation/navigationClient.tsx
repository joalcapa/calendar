'use client'

import React from 'react';
import NavigationServer from './navigationServer';
import useNavigation from './useNavigation';

interface NavigationProps {
  isMount: boolean;
  todayLabelButton?: string;
  monthLabelButton?: string;
  weekLabelButton?: string;
  dayLabelButton?: string;
  dateLabel?: string;
}

const NavigationClient: React.FC<NavigationProps> = (
  {
    isMount = false,
    todayLabelButton = "Hoy",
    monthLabelButton = "Mes",
    weekLabelButton = "Semana",
    dayLabelButton = "Día",
    dateLabel = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
  }
) => (
  <>{isMount ? (
    <nav className="relative flex justify-between items-center p-4 rounded-md">
      <div className="flex space-x-4">
        <button
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
        >
          {monthLabelButton}
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
        >
          {weekLabelButton}
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
        >
          {dayLabelButton}
        </button>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 text-black font-semibold">
        {dateLabel}
      </div>
      <button
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
      >
        {todayLabelButton}
      </button>
    </nav>
  ) : <NavigationServer />}
  </>
)

export default () => {
  const hook = useNavigation();
  return <NavigationClient {...hook} />
}