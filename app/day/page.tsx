import Calendar from '../../app/components/calendar/dia/Day';
import CalendarDay from "../../app/components/calendar/dia/DayHOC";
import GetDayEvents from '../../services/calendar/getDayEvents';
import SmallCalendar from "@/app/components/calendar/smallCalendar/smallCalendar";
import { parseISO } from 'date-fns';
import { Hydrate, ReactQueryProvider } from '../components/rq/RQ';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { EVENTS_RQ } from "../../app/config/constants";
import { DateTime } from "luxon";
import CalendarNavigation from "@/app/components/calendar/navigation/navigationClient";

export default async ({ searchParams }: {
    searchParams?: {
        date?: string,
        type?: string,
    },
}) => {
    const dateParam = searchParams?.date || DateTime.now().toISODate();
    const typeParam = searchParams?.type || "month";
    const parsedDate = parseISO(dateParam);
    const path = dateParam + typeParam;

    const queryClient = new QueryClient();
    const service = new GetDayEvents(parsedDate);
    await service.call()
    const events = service.getEvents();

    await queryClient.prefetchQuery({
        queryKey: [ EVENTS_RQ, path ],
        queryFn: async () => {
            return events;
        },
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <>
            <CalendarNavigation type={typeParam} />
            <ReactQueryProvider state={dehydratedState}>
                <Hydrate state={dehydratedState}>
                    <div key={parsedDate} className="flex flex-1">
                        <div className="w-1/4 md:w-1/5 p-4">
                            <SmallCalendar date={new Date(parsedDate)}/>
                        </div>
                        <div className="flex-1 p-4">
                            <CalendarDay>
                                <Calendar {...events} isHours />
                            </CalendarDay>
                        </div>
                    </div>
                </Hydrate>
            </ReactQueryProvider>
        </>
    );
};