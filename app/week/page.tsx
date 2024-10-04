import CalendarDay from '@/app/components/calendar/dia/Day';
import GetWeekEvents from '@/services/calendar/getWeekEvents';
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
    <>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        {
          service.getEvents().map(day => (
            <div style={{ width: '14.28%' }}>
              <CalendarDay {...day} />
            </div>
          ))
        }
      </div>
    </>
  );
};