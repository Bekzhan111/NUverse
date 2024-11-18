import CardWrapper, { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { CardsSkeleton, LatestInvoicesSkeleton, LatestNewsSkeleton, RevenueChartSkeleton, TodayBirthdaysSkeleton } from '@/app/ui/skeletons';
import LatestNews from '@/app/ui/dashboard/latest-news';
import WeeklyCalendar from '@/app/ui/dashboard/weekly-calendar';
import TodayBirthdays from '@/app/ui/dashboard/today-birthdays';
import { WeeklyCalendarSkeleton } from '@/app/ui/skeletons';

export default async function Page() {
  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper/>
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div> */}
      <div className="mt-6 mb-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestNewsSkeleton />}>
          <LatestNews />
        </Suspense>
        <Suspense fallback={<WeeklyCalendarSkeleton />}>
          <WeeklyCalendar />
        </Suspense>
      </div>
      <Suspense fallback={<TodayBirthdaysSkeleton />}>
        <TodayBirthdays />
      </Suspense>
    </main>
  );
}