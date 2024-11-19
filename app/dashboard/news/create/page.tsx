import { fetchCategories } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/news/create-form';

export default async function Page() {
  const categories = await fetchCategories();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'News', href: '/dashboard/news' },
          {
            label: 'Publish',
            href: '/dashboard/news/create',
            active: true,
          },
        ]}
      />
      <Form categories={categories} />
    </main>
  );
} 