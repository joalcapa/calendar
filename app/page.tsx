import Calendar from '../app/components/calendar/mes/Month';
import GetMonthEvents from '../services/calendar/getMonthEvents';
import { parseISO } from 'date-fns';
import SmallCalendar from "@/app/components/calendar/smallCalendar/smallCalendar";
import CalendarDay from "@/app/components/calendar/dia/DayHOC";

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

  return (
      <div key={parsedDate} className="flex flex-1">
        <div className="w-1/4 md:w-1/5 p-4">
          <SmallCalendar date={new Date(parsedDate)}/>
        </div>
        <div className="flex-1 p-4">
          <Calendar {...service.getEvents()} />
        </div>
      </div>
  );
};