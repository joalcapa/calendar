import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '@/app/components/calendar/navigation/navigationServer';

describe('Navigation Component', () => {
  test('renders default buttons and date', () => {
    render(<Navigation />);

    expect(screen.getByText('Hoy')).toBeInTheDocument();
    expect(screen.getByText('Mes')).toBeInTheDocument();
    expect(screen.getByText('Semana')).toBeInTheDocument();
    expect(screen.getByText('Día')).toBeInTheDocument();

    const today = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  test('renders custom button labels', () => {
    render(
      <Navigation
        todayLabelButton="Today"
        monthLabelButton="Month"
        weekLabelButton="Week"
        dayLabelButton="Day"
        dateLabel="Custom Date"
      />
    );

    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();

    expect(screen.getByText('Custom Date')).toBeInTheDocument();
  });
});
