import Calendar from '../../app/components/calendar/semana/Week';
import GetWeekEvents from '../../services/calendar/getWeekEvents';
import SmallCalendar from "@/app/components/calendar/smallCalendar/smallCalendar";
import { parseISO } from 'date-fns';
import { Hydrate, ReactQueryProvider } from '../components/rq/RQ';
import { EVENTS_WEEK_RQ } from "@/app/config/constants";
import { dehydrate, QueryClient } from "@tanstack/react-query";
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
    const service = new GetWeekEvents(parsedDate);
    await service.call();
    const events = service.getEvents();

    await queryClient.prefetchQuery({
        queryKey: [ EVENTS_WEEK_RQ, path ],
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
                            <Calendar days={events} />
                        </div>
                    </div>
                </Hydrate>
            </ReactQueryProvider>
        </>
    );
};