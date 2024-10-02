import CalendarNavigation from '@/app/components/calendar/navigation/navigationClient';
import CalendarDay from '@/app/components/calendar/day/dayServer';
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
  const typeParam = searchParams?.type || "month";
  const parsedDate = parseISO(dateParam);
  const service = new GetDayEvents(parsedDate);

  await service.call();

  return (
    <>
      {JSON.stringify(service.getEvents())}
      <CalendarNavigation dateLabel={service.getDateLabel()} selectedButton={typeParam} />
      <CalendarDay {...service.getEvents()} />
    </>
  );
};