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
    path: string;
    RQTypes: string;
    dayNumber: number;
};

const EventManager = ({ eventForUpdate, dayForCreateEvent, path, RQTypes, dayNumber }: EventManagerProps) => (
    <>
        {
            eventForUpdate.isVisible && (
                <UpdateEvent
                    {...eventForUpdate}
                    path={path}
                    RQTypes={RQTypes}
                    dayNumber={dayNumber}
                />
            )
        }
        {
            dayForCreateEvent.isVisible && (
                <CreateEvent
                    {...dayForCreateEvent}
                    path={path}
                    RQTypes={RQTypes}
                    dayNumber={dayNumber}
                />
            )
        }
    </>
);

export default EventManager;