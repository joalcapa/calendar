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
    day?: Day | null;
}

export const ItemTypes = {
    EVENT: 'event',
}