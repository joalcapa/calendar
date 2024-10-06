import Calendar from '../app/components/calendar/mes/Month';
import GetMonthEvents from '../services/calendar/getMonthEvents';
import { parseISO } from 'date-fns';
import SmallCalendar from "./components/calendar/smallCalendar/smallCalendar";
import { Hydrate, ReactQueryProvider } from './components/rq/RQ';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { EVENTS_RQ } from "../app/config/constants";

export default async ({ searchParams }: {
    searchParams?: {
        date?: string,
        type?: string,
    },
}) => {
    const dateParam = searchParams?.date || new Date().toISOString();
    const typeParam = searchParams?.type || "month";
    const parsedDate = parseISO(dateParam);
    const path = dateParam + typeParam;

    const queryClient = new QueryClient();
    const service = new GetMonthEvents(parsedDate);
    await service.call()
    const events = service.getEvents();

    await queryClient.prefetchQuery({
        queryKey: [EVENTS_RQ, path],
        queryFn: async () => {
            return events;
        },
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <ReactQueryProvider state={dehydratedState}>
            <Hydrate state={dehydratedState}>
                <div key={parsedDate} className="flex flex-1">
                    <div className="w-1/4 md:w-1/5 p-4">
                        <SmallCalendar date={new Date(parsedDate)} />
                    </div>
                    <div className="flex-1 p-4">
                        <Calendar {...events} path={path} />
                    </div>
                </div>
            </Hydrate>
        </ReactQueryProvider>
    );
};
