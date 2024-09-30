import React from 'react';

interface NavigationProps {
  todayLabelButton?: string;
  monthLabelButton?: string;
  weekLabelButton?: string;
  dayLabelButton?: string;
  label: string;
}

const Navigation: React.FC<NavigationProps> = (
  {
    todayLabelButton = "Hoy",
    monthLabelButton = "Mes",
    weekLabelButton = "Semana",
    dayLabelButton = "Día",
    label = "",
  }
) => (
  <nav className="flex space-x-4 p-4 bg-gray-800 rounded-md shadow-md" >
    <button
      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
    >
      {todayLabelButton}
    </button>
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
    <button
      className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
    >
      {label}
    </button>
  </nav>
);

export default Navigation;