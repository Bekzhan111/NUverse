import { NewsItem } from '@/app/lib/definitions';
import { fetchLatestNews } from '@/app/lib/data';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { getNewsCategoryColor } from '@/app/lib/utils';

export default async function LatestNews() {
  const news = await fetchLatestNews();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl">Latest News</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {news.map((item, i) => (
            <div
              key={item.id}
              className={`flex flex-row items-center justify-between py-4 ${
                i !== news.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="flex flex-col">
                <p className="text-sm font-medium">{item.title}</p>
                <span className={`mt-1 w-fit rounded-full px-2 py-1 text-xs ${getNewsCategoryColor(item.category)}`}>
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 