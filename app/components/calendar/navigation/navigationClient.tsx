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
  onMonth: () => void,
  onWeek: () => void,
  onDay: () => void,
  onResetToday: () => void,
  onPrev: () => void,
  onNext: () => void,
  selectedButton: string;
}

const NavigationClient: React.FC<NavigationProps> = (
  {
    isMount = false,
    todayLabelButton = "Hoy",
    monthLabelButton = "Mes",
    weekLabelButton = "Semana",
    dayLabelButton = "Día",
    dateLabel = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
    onMonth,
    onWeek,
    onDay,
    onResetToday,
    onPrev,
    onNext,
    selectedButton = "month",
  }
) => (
  <>{isMount ? (
    <nav className="relative flex justify-between items-center p-4 rounded-md">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 text-white rounded transition duration-300 ${selectedButton === 'month' ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={onMonth}
        >
          {monthLabelButton}
        </button>
        <button
          className={`px-4 py-2 text-white rounded transition duration-300 ${selectedButton === 'week' ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={onWeek}
        >
          {weekLabelButton}
        </button>
        <button
          className={`px-4 py-2 text-white rounded transition duration-300 ${selectedButton === 'day' ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={onDay}
        >
          {dayLabelButton}
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
          onClick={onPrev}
        >
          {'<'}
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
          onClick={onNext}
        >
          {'>'}
        </button>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 text-black font-semibold">
        {dateLabel}
      </div>
      <button
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
        onClick={onResetToday}
      >
        {todayLabelButton}
      </button>
    </nav>
  ) : <NavigationServer dateLabel={dateLabel} selectedButton={selectedButton} />}
  </>
)

export default (props: { dateLabel: string }) => {
  const hook = useNavigation();
  return <NavigationClient {...hook} dateLabel={props.dateLabel} selectedButton={props.selectedButton} />
}