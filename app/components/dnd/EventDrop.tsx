import React, { ReactNode } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from '../../../app/types/types';
import { Event } from "../../../types/event";
import { Day } from '../../../types/month';

export interface DraggableProps {
    onDrop: () => void,
    children: ReactNode,
}

const EventDrop = ({ children, onDrop }: DraggableProps) => {
    const [, drop] = useDrop({
        accept: ItemTypes.EVENT,
        drop: ({ event, day }: { event: Event, day: Day }) => {
            onDrop(event, day)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    return (
        <div ref={drop}>
            {children}
        </div>
    );
}

export default EventDrop;