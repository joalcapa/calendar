import { useSearchParams } from 'next/navigation';
import { MONTH, WEEK } from './useCalendarNavigation';
import { EVENTS_RQ, EVENTS_WEEK_RQ } from "../config/constants";
import { DateTime } from 'luxon';

const useEventsPath = () => {
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || MONTH.toLocaleLowerCase();
    const date = searchParams.get("date") ||DateTime.now().toISODate();
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