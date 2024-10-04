import CalendarDay from '@/app/components/calendar/dia/Day';
import GetDayEvents from '@/services/calendar/getDayEvents';
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
  const service = new GetDayEvents(parsedDate);

  await service.call();
  return <CalendarDay key={parsedDate} {...service.getEvents()} isHours />;
};