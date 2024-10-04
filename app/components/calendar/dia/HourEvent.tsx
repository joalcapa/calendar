import React, { ReactNode } from 'react';
import { Event } from "@/types/event";
import { Day } from '@/types/month';

interface HourEventProps {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
    isHours: boolean;
    eventStart: number;
    event: Event,
    height: number;
    hourLabel: string;
    leftPosition: string;
    isHovered: boolean;
    isDragging: boolean;
}

const HourEvent = (
    {
        hourLabel,
        height,
        event,
        eventStart,
        isHours,
        leftPosition,
        isHovered,
        isDragging,
        onMouseEnter,
        onMouseLeave,
        onClick,
    }: HourEventProps
): ReactNode => (
    <div
        className="absolute bg-blue-500 text-white cursor-pointer border-2 border-r border-white-200"
        style={{
            top: `${eventStart}px`,
            height: `${height}px`,
            width: '100%',
            left: isHours ? leftPosition : 0,
            right: isHours ? '80px' : 0,
            borderRadius: 10,
            zIndex: isHovered ? 5 : 3,
            paddingTop: height < 40 ? 5 : 0,
            paddingLeft: 5,
            display: 'flex',
            flexDirection: height < 40 ? 'row' : 'column',
            opacity: isDragging ? 0 : 1,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
    >
        <span
            className="text-xs"
            style={{ marginTop: height < 20 ? -9 : 0 }}
        >
            { event.title }
        </span>
        <span className="text-xs"
              style={{
                  marginTop: height < 20 ? -9 : 0,
                  paddingLeft: height < 40 ? 10 : 0,
              }}
        >
            { hourLabel }
        </span>
    </div>
);

export default HourEvent;