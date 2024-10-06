import React, { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from '../../../app/types/types';
import { Event } from "../../../types/event";
import { Day } from '../../../types/month';

export interface DraggableProps {
    event: Event,
    day: Day,
    children: ReactNode,
}

const DraggableEvent = ({ event, day, children }: DraggableProps) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.EVENT,
        item: { event: event, day: day },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag}>
            {children({ isDragging })}
        </div>
    );
};

export default DraggableEvent;