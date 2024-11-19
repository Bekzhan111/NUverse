import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { NewsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import NewsTable from '@/app/ui/news/table';
import { fetchNewsPages } from '@/app/lib/data';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchNewsPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>News</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search news..." />
        <Link
            href="/dashboard/news/create"
            className="flex h-10 items-center rounded-lg bg-[#457b9d] px-4 text-sm font-medium text-white transition-colors hover:bg-[#396b90] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
            <span className="hidden md:block">Publish news</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>
      <Suspense key={query + currentPage} fallback={<NewsTableSkeleton />}>
        <NewsTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}