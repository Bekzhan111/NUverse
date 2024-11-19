import { fetchFilteredNews } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default async function NewsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const news = await fetchFilteredNews(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium">
                  Title
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Category
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {news?.map((item) => (
                <tr
                  key={item.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-4 py-3">{item.title}</td>
                  <td className="whitespace-nowrap px-4 py-3">{item.category}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDateToLocal(item.date)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/dashboard/news/${item.id}`}
                        className="rounded-md border p-2 hover:bg-gray-100"
                      >
                        <EyeIcon className="w-5" />
                      </Link>
                      <Link
                        href={`/dashboard/news/${item.id}/edit`}
                        className="rounded-md border p-2 hover:bg-gray-100"
                      >
                        <PencilIcon className="w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 