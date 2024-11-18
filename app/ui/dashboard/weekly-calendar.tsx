import { CalendarEvent } from '@/app/lib/definitions';
import { fetchWeekEvents } from '@/app/lib/data';
import { getEventTypeColor } from '@/app/lib/utils';

export default async function WeeklyCalendar() {
  const events = await fetchWeekEvents();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
  // Group events by date
  const eventsByDate = events.reduce((acc: { [key: string]: CalendarEvent[] }, event) => {
    const dateStr = event.date.toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {});

  // Get current week dates
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  const weekDates = days.map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl">This Week</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* Calendar Header */}
        <div className="grid grid-cols-5 gap-2 mb-2">
          {days.map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-600">{day}</div>
              <div className={`text-xs ${
                weekDates[index].toDateString() === today.toDateString() 
                  ? 'text-[#457b9d] font-bold' 
                  : 'text-gray-500'
              }`}>
                {weekDates[index].getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-5 gap-2 h-[400px]">
          {weekDates.map((date) => (
            <div 
              key={date.toISOString()} 
              className={`border rounded-lg p-2 h-full overflow-y-auto ${
                date.toDateString() === today.toDateString()
                  ? 'border-[#457b9d] bg-white'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {eventsByDate[date.toDateString()]?.map((event) => (
                <div
                  key={event.id}
                  className="mb-2 last:mb-0"
                >
                  <div className={`rounded-md p-2 text-xs ${getEventTypeColor(event.type)}`}>
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="mt-1 text-xs">
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 