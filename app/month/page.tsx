import Calendar from '../../app/components/calendar/mes/Month';
import GetMonthEvents from '../../services/calendar/getMonthEvents';
import { parseISO } from 'date-fns';
import SmallCalendar from "../components/calendar/smallCalendar/smallCalendar";
import { Hydrate, ReactQueryProvider } from '../components/rq/RQ';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { EVENTS_RQ } from "../../app/config/constants";
import { DateTime } from "luxon";
import CalendarNavigation from "../../app/components/calendar/navigation/navigationClient";

/**
 * Asynchronously fetches and displays the monthly calendar with events.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Object} [params.searchParams] - Optional search parameters.
 * @param {string} [params.searchParams.date] - The date in ISO format. Defaults to today's date.
 * @param {string} [params.searchParams.type] - The type of calendar view. Defaults to "month".
 * @returns {JSX.Element} The rendered calendar component with events.
 */
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
    const service = new GetMonthEvents(parsedDate);
    await service.call();
    const events = service.getEvents();

    await queryClient.prefetchQuery({
        queryKey: [EVENTS_RQ, path],
        queryFn: async () => {
            return events;
        },
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <>
            <CalendarNavigation key={parsedDate} type={typeParam} />
            <ReactQueryProvider state={dehydratedState}>
                <Hydrate state={dehydratedState}>
                    <div className="flex flex-1">
                        <div className="w-1/4 md:w-1/5 p-4 hidden 1470:block">
                            <SmallCalendar key={parsedDate} date={new Date(parsedDate)} />
                        </div>
                        <div className="flex-1 p-4">
                            <Calendar {...events} />
                        </div>
                    </div>
                </Hydrate>
            </ReactQueryProvider>
        </>
    );
};
