import { Event } from "@/types/event";

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
}