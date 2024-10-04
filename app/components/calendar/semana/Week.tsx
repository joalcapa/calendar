'use client'

import { useState, useEffect, useRef } from 'react';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Day } from '../../../../types/month'
import CalendarDay from '../../../../app/components/calendar/dia/Day';

interface WeekDayProps {
    onDragEvent: () => void;
    onDropEvent: () => void;
    days: Day[],
}

const Week = ({ onDropEvent, onDragEvent, days }: WeekDayProps) => (
    <DndProvider backend={HTML5Backend}>
        <div className="flex flex-row w-full">
            {
                days.map(day => (
                    <div key={day.days[0].day} className="w-[14.28%]">
                        <CalendarDay
                            {...day}
                            isHours={false}
                            onDropEvent={onDropEvent}
                            onDragEvent={onDragEvent}
                        />
                    </div>
                ))
            }
        </div>
    </DndProvider>
);

export default (props) => {
    const [dragDay, setDragDay] = useState(null);
    const [dropDay, setDropDay] = useState(null);
    const [dragEvent, setDragEvent] = useState(null);
    const [dropHour, setDropHour] = useState(null);
    const callbackDelete = useRef(()=> {});
    const callbackCreate = useRef(()=> {});

    const onDragEvent = (event: Event, day: Day, onDeleteEvent: () => void) => {
        setDragEvent(event);
        setDragDay(day)
        callbackDelete.current = onDeleteEvent
    };

    const onDropEvent = (hour: number, day: Day, onCreateEvent: () => void) => {
        setDropDay(day)
        setDropHour(hour)
        callbackCreate.current = onCreateEvent
    };

    useEffect(() => {
        if (!!dragEvent && !!dragDay && !!dropDay && !!dropHour) {
            callbackDelete.current(dragEvent);
            callbackCreate.current(dragEvent);
        }
    }, [dragEvent, dragDay, dropDay, dropHour, callbackDelete, callbackCreate]);

    return <Week {...props} onDropEvent={onDropEvent} onDragEvent={onDragEvent}/>
};