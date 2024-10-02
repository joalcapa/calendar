import CalendarMonth from '@/app/components/calendar/month/monthClient';
import GetMonthEvents from '@/services/calendar/getMonthEvents';
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
  const service = new GetMonthEvents(parsedDate);

  await service.call();
  return <CalendarMonth {...service.getEvents()} />;
};