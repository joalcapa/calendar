import { useSearchParams } from 'next/navigation';
import { MONTH, WEEK } from './useCalendarNavigation';
import { EVENTS_RQ, EVENTS_WEEK_RQ } from "../config/constants";
import { DateTime } from 'luxon';

/**
 * Custom hook to generate the path and query key for fetching events based on search parameters.
 *
 * @returns An object containing the event path, request type, and query key.
 * @returns path - The constructed path based on the current date and event type.
 * @returns rqType - The request type constant indicating whether it's a weekly or general event request.
 * @returns isWeek - Boolean indicating if the current event type is a week view.
 * @returns queryKey - The key used for caching and identifying the query in React Query.
 */
const useEventsPath = () => {
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || MONTH.toLocaleLowerCase();
    const date = searchParams.get("date") || DateTime.now().toISODate();
    const path = `${date}${type}`;
    const isWeek = type === WEEK.toLocaleLowerCase();
    const rqType = isWeek ? EVENTS_WEEK_RQ : EVENTS_RQ;

    return {
        path,
        rqType,
        isWeek,
        queryKey: [ rqType, path ],
    }
};

export default useEventsPath;
