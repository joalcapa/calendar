import Calendar from '../../app/components/calendar/semana/Week';
import GetWeekEvents from '../../services/calendar/getWeekEvents';
import { parseISO } from 'date-fns';

export default async ({
  searchParams
}: {
  searchParams?: {
    date?: string,
    type?: string,
  }
}) => {
  const dateParam = searchParams?.date || new Date().toISOString();
  const parsedDate = parseISO(dateParam);
  const service = new GetWeekEvents(parsedDate);

  await service.call();

  return (
    <Calendar key={parsedDate} days={service.getEvents()} />
  );
};