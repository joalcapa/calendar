import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { es } from 'date-fns/locale';

export default function SmallCalendar({ date }) {
  const currentMonth = date;

  const renderHeader = () => {
    return (
        <div className="flex justify-between items-center mb-2">
          <button>
            &#8249;
          </button>
          <span className="text-lg font-medium">{format(currentMonth, "MMMM yyyy", { locale: es }).charAt(0).toUpperCase() + format(currentMonth, "MMMM yyyy", { locale: es }).slice(1)}</span>
          <button>
            &#8250;
          </button>
        </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
    for (let i = 0; i < 7; i++) {
      const dayName = format(addDays(startDate, i), "EEE", { locale: es });
      days.push(
          <div key={i} className="text-center font-medium">
            {dayName.charAt(0).toUpperCase()} {}
          </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
            <div
                key={day}
                className={`p-2 text-center border ${isSameMonth(day, monthStart) ? "" : "text-gray-400"}
                ${
                    isSameDay(day, new Date()) ?
                        "bg-orange-500 hover:bg-orange-200 text-white" :
                        isSameDay(day, currentMonth) ?
                            "bg-blue-500 hover:bg-blue-200 text-white" : ""
                }
                cursor-pointer`}
            >
              {format(day, "d", { locale: es })}
            </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
          <div key={day} className="grid grid-cols-7">
            {days}
          </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
      <div className="bg-white p-4 rounded w-64">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
  );
}