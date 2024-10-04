import React, { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from '../../../app/types/types';
import { Event } from "../../../types/event";
import { Day } from '../../../types/month';

export interface DraggableProps {
    event: Event,
    day: Day,
    onDrag: (event: Event, day: Day) => void,
    children: ReactNode,
}

const DraggableEvent = ({ event, day, onDrag, children }: DraggableProps) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.EVENT,
        item: { event: event, day: day },
        collect: (monitor) => {
            if (monitor.isDragging()) {
                onDrag(event, day)
            }

            return {
                isDragging: monitor.isDragging(),
            }
        },
    });

    return (
        <div ref={drag}>
            {children({ isDragging })}
        </div>
    );
};

export default DraggableEvent;