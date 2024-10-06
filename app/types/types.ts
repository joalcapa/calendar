import { Event } from "../../types/event";
import { Day } from '../../types/month';

export interface TargetEvent {
    target: {
        value: string,
    },
}

export interface TargetCheckEvent {
    target: {
        checked: boolean,
    },
}

export interface CreateEventProps {
    onClose: () => void;
    isDelete?: boolean;
    onCreateEvent?: (event: Event) => void;
    day: Day | null;
    dayNumber?: number;
}

export const ItemTypes = {
    EVENT: 'event',
}