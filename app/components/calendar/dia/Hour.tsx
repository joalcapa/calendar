import React, { ReactNode } from "react";
import EventDrop from "../../../../app/components/dnd/EventDrop";
import { getHourLabel } from '../../../../app/utils/utils';

interface HourHocProps {
    onDrop: () => void;
    onHour: () => void;
    isHours: boolean;
    hour: number;
    isSmallHour?: boolean;
}

interface HourProps {
    onHour: () => void;
    isHours: boolean;
    hour: number;
    isSmallHour?: boolean;
}

export const Hour = ({ onHour, isHours, hour, isSmallHour = false }: HourProps) => (
    <div
        data-testid="hour"
        onClick={onHour}
        className="border-t border-b border-gray-200 relative h-16 flex items-center cursor-pointer hover:bg-gray-300">
        {
            isHours && (
                <span className={`${isSmallHour ? 'relative float-left -left-12 text-[0.7rem] pr-2' : 'absolute left-2 top-0 text-xs'}`}>
                    { getHourLabel(hour) }
                </span>
            )
        }
    </div>
);

const HourHoc = ({ onDrop, onHour, isHours, hour, isSmallHour = false }: HourHocProps): ReactNode => (
    <EventDrop onDrop={onDrop}>
        <Hour
            onHour={onHour}
            isHours={isHours}
            hour={hour}
            isSmallHour={isSmallHour}
        />
    </EventDrop>
);

export default HourHoc;