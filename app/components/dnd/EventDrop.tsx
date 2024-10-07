import React, { ReactNode } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from '../../../app/types/types';
import { Event } from "../../../types/event";
import { Day } from '../../../types/month';

/**
 * Props for the EventDrop component.
 *
 * @interface DraggableProps
 * @property {() => void} onDrop - Callback function invoked when an event is dropped.
 * @property {ReactNode} children - The child components or elements to be rendered inside the drop area.
 * @property {string} [className] - Optional CSS class for styling the drop area.
 */
export interface DraggableProps {
    onDrop: (event: Event, day: Day) => void; // Callback for when an event is dropped
    children: ReactNode; // Child components to be rendered
    className?: string; // Optional class for styling
}

/**
 * A component that serves as a drop area for draggable events.
 * It uses React DnD to enable drag-and-drop functionality for events.
 *
 * @param {DraggableProps} props - The properties for the component.
 * @returns {JSX.Element} A div that acts as a drop target for draggable events.
 */
const EventDrop = ({ children, onDrop, className }: DraggableProps): JSX.Element => {
    const [, drop] = useDrop({
        accept: ItemTypes.EVENT, // The type of items that can be dropped
        drop: ({ event, day }: { event: Event; day: Day }) => {
            onDrop(event, day); // Invoke the onDrop callback with the dropped event and day
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(), // Check if the drop target is currently hovered over
            canDrop: monitor.canDrop(), // Check if the drop is allowed
        }),
    });

    return (
        <div className={className} ref={drop}>
            {children} {/* Render the child components */}
        </div>
    );
}

export default EventDrop;
