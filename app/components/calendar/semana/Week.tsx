'use client'

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Day } from '../../../../types/month'
import CalendarDay from '../../../../app/components/calendar/dia/Day';

const Week = ({ days }: { days: Day[] }) => (
    <DndProvider backend={HTML5Backend}>
        <div className="flex flex-row w-full">
            <div className="w-[14.28%]">
                <CalendarDay {...days[0]} isHours={false} dayNumber={0} />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay {...days[1]} isHours={false} dayNumber={1} />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay {...days[2]} isHours={false} dayNumber={2} />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay {...days[3]} isHours={false} dayNumber={3} />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay {...days[4]} isHours={false} dayNumber={4} />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay {...days[5]} isHours={false} dayNumber={5} />
            </div>
            <div className="w-[14.28%]">
                <CalendarDay {...days[6]} isHours={false} dayNumber={6} />
            </div>
        </div>
    </DndProvider>
);

export default Week;