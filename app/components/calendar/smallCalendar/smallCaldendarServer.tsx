import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { es } from 'date-fns/locale'; // Importa el locale en español
import { GetServerSideProps } from 'next';

interface SmallCalendarProps {
  currentMonth: Date;
}

const SmallCalendar: React.FC<SmallCalendarProps> = ({ currentMonth }) => {
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2">
      <span className="text-lg font-medium">{format(currentMonth, "MMMM yyyy", { locale: es }).charAt(0).toUpperCase() + format(currentMonth, "MMMM yyyy", { locale: es }).slice(1)}</span>
    </div>
  );

  const renderDays = () => {
    const days: JSX.Element[] = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 }); // Cambiar para iniciar en domingo
    for (let i = 0; i < 7; i++) {
      const dayName = format(addDays(startDate, i), "EEE", { locale: es });
      days.push(
        <div key={i} className="text-center font-medium">
          {dayName.charAt(0).toUpperCase()} {/* Solo la primera letra en mayúscula */}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Cambiar para iniciar en domingo
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Cambiar para iniciar en domingo

    const rows: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={day.toString()} // Usar toString() para evitar problemas con la clave
            className={`p-2 text-center border ${isSameMonth(day, monthStart) ? "" : "text-gray-400"} 
            ${isSameDay(day, new Date()) ? "bg-blue-500 text-white" : ""}
            hover:bg-blue-200 cursor-pointer`}
          >
            {format(day, "d", { locale: es })} {/* Aplica el locale aquí */}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="bg-white p-4 rounded w-64">
      {JSON.stringify(currentMonth)}
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default SmallCalendar;