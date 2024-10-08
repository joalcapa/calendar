'use client'

import React from 'react';
import NavigationServer from './navigationServer';
import useNavigation from './useNavigation';
import { SessionProvider } from 'next-auth/react';
import { View, MONTH, WEEK, DAY } from '../../../../app/hooks/useCalendarNavigation';

interface NavigationProps {
  isMount: boolean;
  todayLabelButton?: string;
  monthLabelButton?: string;
  weekLabelButton?: string;
  dayLabelButton?: string;
  onMonth: () => void,
  onWeek: () => void,
  onDay: () => void,
  onResetToday: () => void,
  onPrev: () => void,
  onNext: () => void,
  selectedButton: string;
  view: View;
  signOut: () => void,
  signIn: () => void,
  isSession: boolean,
}

const NavigationClient: React.FC<NavigationProps> = (
  {
    isMount = false,
    todayLabelButton = "Hoy",
    monthLabelButton = "Mes",
    weekLabelButton = "Semana",
    dayLabelButton = "Día",
    onMonth,
    onWeek,
    onDay,
    onResetToday,
    onPrev,
    onNext,
    view,
    signOut,
    signIn,
    isSession,
  }
) => (
  <>{isMount ? (
    <nav className="relative flex justify-between items-center p-4 rounded-md">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 text-white rounded transition duration-300 ${view === MONTH ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={onMonth}
        >
          {monthLabelButton}
        </button>
        <button
          className={`px-4 py-2 text-white rounded transition duration-300 ${view === WEEK ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={onWeek}
        >
          {weekLabelButton}
        </button>
        <button
          className={`px-4 py-2 text-white rounded transition duration-300 ${view === DAY ? 'shadow-lg shadow-red-400 bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
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
        <div className="flex space-x-4">
            <button
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
                onClick={isSession ? signOut : signIn}
            >
                { isSession ? "Salir" : "Google" }
            </button>
            <button
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-300"
                onClick={onResetToday}
            >
                {todayLabelButton}
            </button>
        </div>
    </nav>
  ) : <NavigationServer view={view}/>}
  </>
)

const Nav = (props: { type: string }) => {
    const hook = useNavigation(props);
    return <NavigationClient {...hook} />;
}

export default (props: { type: string }) => (
    <SessionProvider>
        <Nav {...props} />
    </SessionProvider>
);