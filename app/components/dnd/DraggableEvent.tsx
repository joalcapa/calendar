import React, { ReactNode } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from '../../../app/types/types';
import { Event } from "../../../types/event";
import { Day } from '../../../types/month';

export interface DraggableProps {
    event: Event,
    day: Day,
    children: ReactNode,
    className?: string;
}

const DraggableEvent = ({ event, day, children, className }: DraggableProps) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.EVENT,
        item: { event: event, day: day },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div className={className} ref={drag}>
            {children({ isDragging })}
        </div>
    );
};

export default DraggableEvent;