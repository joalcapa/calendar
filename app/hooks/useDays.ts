import { useQuery } from "@tanstack/react-query";
import { EVENTS_RQ, EVENTS_WEEK_RQ } from "../config/constants";

const useEvents = ({ path, RQTypes, dayNumber } : { path: string, RQTypes?: string, dayNumber?: number }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: [ RQTypes || EVENTS_RQ, path ],
        queryFn: async () => {
            return {}
        },
        staleTime: Infinity,
        initialData: () => {
            return typeof window !== 'undefined' ? window.__REACT_QUERY_STATE__?.[EVENTS_RQ]?.data : null;
        },
    });

    return {
        days: RQTypes === EVENTS_WEEK_RQ ? data[dayNumber].days : data.days,
        isLoading,
        error,
    }
};

export default useEvents;