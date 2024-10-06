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
    path: string;
    RQTypes: string;
}

const Week = ({ onDropEvent, onDragEvent, days, path, RQTypes }: WeekDayProps) => (
    <DndProvider backend={HTML5Backend}>
        <div className="flex flex-row w-full">
            <div className="w-[14.28%]">
                <CalendarDay
                    {...days[0]}
                    isHours={false}
                    onDropEvent={onDropEvent}
                    onDragEvent={onDragEvent}
                    path={path}
                    dayNumber={0}
                    RQTypes={RQTypes}
                />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay
                    {...days[1]}
                    isHours={false}
                    onDropEvent={onDropEvent}
                    onDragEvent={onDragEvent}
                    path={path}
                    dayNumber={1}
                    RQTypes={RQTypes}
                />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay
                    {...days[2]}
                    isHours={false}
                    onDropEvent={onDropEvent}
                    onDragEvent={onDragEvent}
                    path={path}
                    dayNumber={2}
                    RQTypes={RQTypes}
                />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay
                    {...days[3]}
                    isHours={false}
                    onDropEvent={onDropEvent}
                    onDragEvent={onDragEvent}
                    path={path}
                    dayNumber={3}
                    RQTypes={RQTypes}
                />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay
                    {...days[4]}
                    isHours={false}
                    onDropEvent={onDropEvent}
                    onDragEvent={onDragEvent}
                    path={path}
                    dayNumber={4}
                    RQTypes={RQTypes}
                />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay
                    {...days[5]}
                    isHours={false}
                    onDropEvent={onDropEvent}
                    onDragEvent={onDragEvent}
                    path={path}
                    dayNumber={5}
                    RQTypes={RQTypes}
                />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay
                    {...days[6]}
                    isHours={false}
                    onDropEvent={onDropEvent}
                    onDragEvent={onDragEvent}
                    path={path}
                    dayNumber={6}
                    RQTypes={RQTypes}
                />
            </div>
        </div>
    </DndProvider>
);

export default (props) => {
    const [dragDay, setDragDay] = useState(null);
    const [dropDay, setDropDay] = useState(null);
    const [dragEvent, setDragEvent] = useState(null);
    const [dropHour, setDropHour] = useState(null);
    const callbackDelete = useRef(() => {
    });
    const callbackCreate = useRef(() => {});

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
    }, [
        dragEvent,
        dragDay,
        dropDay,
        dropHour,
        callbackDelete,
        callbackCreate,
    ]);

    console.log(props)
    return (
        <Week
            {...props}
            onDropEvent={onDropEvent}
            onDragEvent={onDragEvent}
        />
    );
};