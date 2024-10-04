import Calendar from '../../app/components/calendar/dia/Day';
import CalendarDay from "../../app/components/calendar/dia/DayHOC";
import GetDayEvents from '../../services/calendar/getDayEvents';
import SmallCalendar from "@/app/components/calendar/smallCalendar/smallCalendar";
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

  return (
      <div key={parsedDate} className="flex flex-1">
        <div className="w-1/4 md:w-1/5 p-4">
          <SmallCalendar date={new Date(parsedDate)}/>
        </div>
        <div className="flex-1 p-4">
          <CalendarDay>
            <Calendar
                {...service.getEvents()}
                isHours
            />
          </CalendarDay>
        </div>
      </div>
  );
};