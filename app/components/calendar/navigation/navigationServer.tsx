
import React from 'react';

import { View, MONTH, WEEK, DAY } from '@/app/hooks/useCalendarNavigation';

interface NavigationProps {
  todayLabelButton?: string;
  monthLabelButton?: string;
  weekLabelButton?: string;
  dayLabelButton?: string;
  selectedButton?: string;
  view: View;
}

const Navigation: React.FC<NavigationProps> = (
  {
    todayLabelButton = "Hoy",
    monthLabelButton = "Mes",
    weekLabelButton = "Semana",
    dayLabelButton = "Día",
    view,
  }
) => (
  <nav className="relative flex justify-between items-center p-4 rounded-md">
    <div className="flex space-x-4">
      <button
        className={`px-4 py-2 text-white rounded transition duration-300 ${view === MONTH ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {monthLabelButton}
      </button>
      <button
        className={`px-4 py-2 text-white rounded transition duration-300 ${view === WEEK ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {weekLabelButton}
      </button>
      <button
        className={`px-4 py-2 text-white rounded transition duration-300 ${view === DAY ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {dayLabelButton}
      </button>
      <button
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
      >
        {'<'}
      </button>
      <button
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
      >
        {'>'}
      </button>
    </div>
    <button
      className={`px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300`}
    >
      {todayLabelButton}
    </button>
  </nav>
);

export default Navigation;
