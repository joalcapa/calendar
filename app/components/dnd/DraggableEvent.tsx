import React, { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from '../../../app/types/types';
import { Event } from "../../../types/event";
import { Day } from '../../../types/month';

/**
 * Props for the DraggableEvent component.
 *
 * @interface DraggableProps
 * @property {Event} event - The event object to be dragged.
 * @property {Day} day - The day object associated with the event.
 * @property {ReactNode} children - A function that receives the drag state.
 * @property {string} [className] - Optional CSS class for styling the draggable event.
 */
export interface DraggableProps {
    event: Event; // The event object to be dragged
    day: Day; // The day object associated with the event
    children: (props: { isDragging: boolean }) => ReactNode; // Function that receives the drag state
    className?: string; // Optional class for styling
}

/**
 * A component that represents a draggable event.
 * It uses React DnD to allow the event to be dragged and dropped.
 *
 * @param {DraggableProps} props - The properties for the component.
 * @returns {JSX.Element} A div that represents the draggable event.
 */
const DraggableEvent = ({ event, day, children, className }: DraggableProps): JSX.Element => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.EVENT, // The type of item being dragged
        item: { event: event, day: day }, // The data to be passed on drag
        collect: (monitor) => ({
            isDragging: monitor.isDragging(), // Monitor the drag state
        }),
    });

    return (
        <div className={className} ref={drag}>
            {children({ isDragging })} {/* Render the child function with the drag state */}
        </div>
    );
};

export default DraggableEvent;
