import React, { ReactNode } from 'react';
import { Event } from "../../../../types/event";

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
        className={`absolute bg-blue-500 text-white cursor-pointer border-2 border-r border-white-200 flex ${isDragging ? 'opacity-0' : 'opacity-100'} ${height < 40 ? 'flex-row' : 'flex-col'} ${isHovered ? 'z-[5]' : 'z-[3]'} rounded-[10px] pl-[5px] ${height < 40 ? 'pt-[5px]' : 'pt-0'}`}
        style={{
            top: `${eventStart}px`,
            height: `${height}px`,
            width: '100%',
            left: isHours ? leftPosition : 0,
            right: isHours ? '80px' : 0,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
    >
        <span className={`text-x ${height < 20 ? "mt-[-9px]" : "mt-0"}`}>
            { event.title }
        </span>
        <span className={`text-xs ${height < 20 ? 'mt-[-9px]' : 'mt-0'} ${height < 40 ? 'pl-[10px]' : 'pl-0'}`}>
            { hourLabel }
        </span>
    </div>
);

export default HourEvent;