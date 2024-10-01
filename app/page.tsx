

import CalendarNavigation from '@/app/components/calendar/navigation/navigationClient';
import CalendarMonth from '@/app/components/calendar/month/month';
import GetMonthEvents from '@/services/calendar/getMonthEvents';

export default async (props: any) => {
  const service = new GetMonthEvents();
  await service.call();

  return (
    <>
      <CalendarNavigation />
      <CalendarMonth {...service.getEvents()} />
    </>
  )
};
