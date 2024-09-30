import React from 'react';

interface NavigationProps {
  todayLabelButton?: string;
  monthLabelButton?: string;
  weekLabelButton?: string;
  dayLabelButton?: string;
  onResetToday?: () => void,
  onMonth?: () => void,
  onWeek?: () => void,
  onDay?: () => void,
}

const Navigation: React.FC<NavigationProps> = (
  {
    todayLabelButton = "Hoy",
    monthLabelButton = "Mes",
    weekLabelButton = "Semana",
    dayLabelButton = "Día",
    onResetToday = () => { },
    onMonth = () => { },
    onWeek = () => { },
    onDay = () => { },
  }
) => (
  <nav className="flex space-x-4 p-4 bg-gray-800 rounded-md shadow-md" >
    <button
      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
      onClick={onResetToday}
    >
      {todayLabelButton}
    </button>
    <button
      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
      onClick={onMonth}
    >
      {monthLabelButton}
    </button>
    <button
      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
      onClick={onWeek}
    >
      {weekLabelButton}
    </button>
    <button
      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
      onClick={onDay}
    >
      {dayLabelButton}
    </button>
  </nav>
);

export default Navigation;