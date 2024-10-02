
import React from 'react';

interface NavigationProps {
  todayLabelButton?: string;
  monthLabelButton?: string;
  weekLabelButton?: string;
  dayLabelButton?: string;
  dateLabel?: string;
  selectedButton?: string;
}

const Navigation: React.FC<NavigationProps> = (
  {
    todayLabelButton = "Hoy",
    monthLabelButton = "Mes",
    weekLabelButton = "Semana",
    dayLabelButton = "Día",
    dateLabel = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
    selectedButton = "month",
  }
) => (
  <nav className="relative flex justify-between items-center p-4 rounded-md">
    <div className="flex space-x-4">
      <button
        className={`px-4 py-2 text-white rounded transition duration-300 ${selectedButton === 'month' ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {monthLabelButton}
      </button>
      <button
        className={`px-4 py-2 text-white rounded transition duration-300 ${selectedButton === 'week' ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {weekLabelButton}
      </button>
      <button
        className={`px-4 py-2 text-white rounded transition duration-300 ${selectedButton === 'day' ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
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
    <div className="absolute left-1/2 transform -translate-x-1/2 text-black font-semibold">
      {dateLabel}
    </div>
    <button
      className={`px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300 ${selectedButton === 'today' ? 'shadow-lg shadow-blue-400' : ''}`}
    >
      {todayLabelButton}
    </button>
  </nav>
);

export default Navigation;
