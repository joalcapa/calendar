'use client'

import { useState, useEffect, useRef } from 'react';
import CalendarDay from '@/app/components/calendar/dia/Day';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

const Week = (props) => (
    <DndProvider backend={HTML5Backend}>
        <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
            {
                props.days.map(day => (
                    <div key={day.days[0].day} style={{width: '14.28%'}}>
                        <CalendarDay  {...day} isHours={false} onDropEvent={props.onDropEvent} onDragEvent={props.onDragEvent}/>
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
        console.log("Hola")
    };

    const onDropEvent = (hour: number, day: Day, onCreateEvent: () => void) => {
        setDropDay(day)
        setDropHour(hour)
        callbackCreate.current = onCreateEvent
        alert("Y eso")
    };

    useEffect(() => {
        console.log("TTTT", dragEvent, dragDay, dropDay, dropHour)
        if (!!dragEvent && !!dragDay && !!dropDay && !!dropHour) {
            console.log("a trasladar")
            callbackDelete.current(dragEvent);
            callbackCreate.current(dragEvent);
        }
    }, [dragEvent, dragDay, dropDay, dropHour, callbackDelete, callbackCreate]);

    return <Week {...props} onDropEvent={onDropEvent} onDragEvent={onDragEvent}/>
};