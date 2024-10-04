import Calendar from '../../app/components/calendar/dia/Day';
import CalendarDay from "../../app/components/calendar/dia/DayHOC";
import GetDayEvents from '../../services/calendar/getDayEvents';
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

  console.log("HOLAAAAAA: ", service.error)
  console.log("DIA ---->", service.getEvents())

  return (
      <CalendarDay>
        <Calendar
            key={parsedDate}
            {...service.getEvents()}
            isHours
        />
      </CalendarDay>
  );
};