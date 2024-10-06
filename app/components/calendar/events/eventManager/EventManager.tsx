import React from "react";
import UpdateEvent from "../../../../../app/components/calendar/events/update/updateEvent";
import CreateEvent from "../../../../../app/components/calendar/events/create/createEvent";

interface EventManagerProps {
    eventForUpdate: {
        isVisible: boolean;
    };
    dayForCreateEvent: {
        isVisible: boolean;
    };
    dayNumber: number;
};

const EventManager = ({ eventForUpdate, dayForCreateEvent, dayNumber }: EventManagerProps) => (
    <>
        {
            eventForUpdate.isVisible && (
                <UpdateEvent
                    {...eventForUpdate}
                    dayNumber={dayNumber}
                />
            )
        }
        {
            dayForCreateEvent.isVisible && (
                <CreateEvent
                    {...dayForCreateEvent}
                    dayNumber={dayNumber}
                />
            )
        }
    </>
);

export default EventManager;