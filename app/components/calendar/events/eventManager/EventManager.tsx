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
};

const EventManager = ({ eventForUpdate, dayForCreateEvent }: EventManagerProps) => (
    <>
        {eventForUpdate.isVisible && <UpdateEvent {...eventForUpdate} />}
        {dayForCreateEvent.isVisible && <CreateEvent {...dayForCreateEvent} />}
    </>
);

export default EventManager;