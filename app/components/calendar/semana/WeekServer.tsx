import CalendarDay from '../../../../app/components/calendar/dia/Day'

const Week = (props) => (
    <div className="flex flex-row w-full">
        {
            props.days.map((day) => (
                <div className="w-[14.28%]">
                    <CalendarDay {...day} isHours={false}/>
                </div>
            ))
        }
    </div>
);

export default Week;