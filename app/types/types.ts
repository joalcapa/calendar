import { Day } from '../../types/month';

/**
 * Represents a target event containing a value.
 */
export interface TargetEvent {
    target: {
        value: string,
    },
}

/**
 * Represents a target check event containing a checked state.
 */
export interface TargetCheckEvent {
    target: {
        checked: boolean,
    },
}

/**
 * Properties for creating an event component.
 */
export interface CreateEventProps {
    /** Function to close the event creation modal. */
    onClose: () => void;
    /** Optional flag to indicate if the event is being deleted. */
    isDelete?: boolean;
    /** Optional day information associated with the event. */
    day?: Day | null;
}

/**
 * Defines item types for drag-and-drop functionality.
 */
export const ItemTypes = {
    /** Represents an event item type. */
    EVENT: 'event',
};
