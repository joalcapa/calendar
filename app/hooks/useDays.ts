import { useQuery } from "@tanstack/react-query";
import useEventsPath from "./useEventsPath";

/**
 * Custom hook to fetch events based on the specified day number.
 *
 * @param params - The parameters for fetching events.
 * @param params.dayNumber - Optional day number to specify which day's events to retrieve.
 *
 * @returns An object containing event data and loading/error states.
 * @returns days - The days of events based on the day number, or all days if isWeek is false.
 * @returns isLoading - Boolean indicating if the query is currently loading.
 * @returns error - The error object if the query fails.
 */
const useEvents = ({ dayNumber }: { dayNumber?: number }) => {
    const { queryKey, rqType, isWeek } = useEventsPath();

    const { data, isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            return {}
        },
        staleTime: Infinity,
        initialData: () => {
            return typeof window !== 'undefined' ? window.__REACT_QUERY_STATE__?.[rqType]?.data : null;
        },
    });

    return {
        days: isWeek ? data[dayNumber].days : data.days,
        isLoading,
        error,
    }
};

export default useEvents;
