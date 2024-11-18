import { Birthday } from '@/app/lib/definitions';
import { fetchTodayBirthdays } from '@/app/lib/data';
import { CakeIcon } from '@heroicons/react/24/outline';

function getPositionColor(position: string): string {
  const colors: { [key: string]: string } = {
    'Professor': 'bg-[#457b9d] text-white',
    'Associate Professor': 'bg-[#6ea2c2] text-white',
    'Assistant Professor': 'bg-[#89c2d9] text-white',
    'Student': 'bg-[#d69b39] text-white',
    'Staff': 'bg-[#ecd49c] text-gray-800'
  };
  return colors[position] || 'bg-gray-100 text-gray-800';
}

export default async function TodayBirthdays() {
  const birthdays = await fetchTodayBirthdays();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl">Today's Birthdays</h2>
        <div className="flex items-center gap-1 text-sm text-[#367184]">
          <CakeIcon className="h-5 w-5" />
          <span>{birthdays.length} celebrations</span>
        </div>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2">
        {birthdays.map((person) => (
          <div
            key={person.id}
            className="relative flex flex-col rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md min-w-[220px]"
          >
            <div className="absolute top-4 right-4">
              <CakeIcon className="h-5 w-5 text-[#d69b39]" />
            </div>
            
            <div className="flex flex-col mb-3">
              <div className="h-12 w-12 rounded-full bg-[#fbf6eb] flex items-center justify-center mb-3">
                <span className="text-lg font-medium text-[#d69b39]">
                  {person.name.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-medium text-gray-900">{person.name}</p>
                  <p className="text-sm text-gray-500">{person.department}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full w-fit ${getPositionColor(person.position)}`}>
                  {person.position}
                </span>
              </div>
            </div>
            
            <div className="mt-auto pt-3 border-t">
              <span className="text-sm text-gray-600">
                {new Date(person.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 