import React, { ReactNode } from "react";
import EventDrop from "../../../../app/components/dnd/EventDrop";
import { getHourLabel } from '../../../../app/utils/utils';

interface HourProps {
    onDrop: () => void;
    onHour: () => void;
    isHours: boolean;
    hour: number;
    isSmallHour?: boolean;
}

const Hour = ({ onDrop, onHour, isHours, hour, isSmallHour = false }: HourProps): ReactNode => (
    <EventDrop onDrop={onDrop}>
        <div
            onClick={onHour}
            className="border-t border-b border-gray-200 relative h-16 flex items-center cursor-pointer hover:bg-gray-300">
            { isHours && <span className={`${isSmallHour ? 'relative float-left -left-12 text-[0.7rem] pr-2' : 'absolute left-2 top-0 text-xs'}`}>{getHourLabel(hour)}</span> }
        </div>
    </EventDrop>
);

export default Hour;