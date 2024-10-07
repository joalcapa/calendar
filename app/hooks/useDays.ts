import { useQuery } from "@tanstack/react-query";
import useEventsPath from "./useEventsPath";

const useEvents = ({ dayNumber } : { dayNumber?: number }) => {
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