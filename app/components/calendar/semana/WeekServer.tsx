import CalendarDay from '@/app/components/calendar/dia/Day'

const Week = (props) => (
    <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
        {
            props.days.map(day => (
                <div style={{width: '14.28%'}}>
                    <CalendarDay {...day} isHours={false}/>
                </div>
            ))
        }
    </div>
);

export default Week;