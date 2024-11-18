import { sql } from '@vercel/postgres';
import {
  Birthday,
  CalendarEvent,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  NewsItem,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    console.log(invoice);

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchLatestNews() {
  try {
    const news: NewsItem[] = [
      {
        id: '1',
        title: 'NU Researchers Win Major International Grant',
        date: '2024-03-20',
        category: 'Research',
        summary: 'School of Sciences and Humanities team secures $2M research grant'
      },
      {
        id: '2',
        title: 'Spring Student Organizations Fair',
        date: '2024-03-19',
        category: 'Student Life',
        summary: 'Join us at the Atrium to discover 50+ student clubs'
      },
      {
        id: '3',
        title: 'NUSOM Launches New Medical Program',
        date: '2024-03-18',
        category: 'Academics',
        summary: 'New specialization in Digital Health Technologies'
      },
      {
        id: '4',
        title: 'NU Basketball Team Advances to Finals',
        date: '2024-03-17',
        category: 'Sports',
        summary: 'Victory against ENU in national championship semifinals'
      },
      {
        id: '5',
        title: 'Career Fair 2024 Announcement',
        date: '2024-03-16',
        category: 'Career Services',
        summary: 'Over 50 companies attending, including Big Tech firms'
      },
      {
        id: '6',
        title: 'New Partnership with MIT Announced',
        date: '2024-03-15',
        category: 'International',
        summary: 'Joint research program in renewable energy'
      }
    ];
    return news;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch latest news.');
  }
}

export async function fetchWeekEvents() {
  try {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(monday.getDate() - monday.getDay() + 1);

    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'University Senate Meeting',
        date: new Date(monday),
        time: '10:00 AM',
        type: 'academic'
      },
      {
        id: '2',
        title: 'NUSTEM Research Symposium',
        date: new Date(monday.setDate(monday.getDate() + 1)),
        time: '2:30 PM',
        type: 'research'
      },
      {
        id: '3',
        title: 'Student Government Elections',
        date: new Date(monday.setDate(monday.getDate() + 1)),
        time: '11:00 AM',
        type: 'student'
      },
      {
        id: '4',
        title: 'Guest Lecture: AI in Healthcare',
        date: new Date(monday.setDate(monday.getDate() + 1)),
        time: '3:00 PM',
        type: 'lecture'
      },
      {
        id: '5',
        title: 'NUGSB Alumni Networking',
        date: new Date(monday.setDate(monday.getDate() + 1)),
        time: '6:30 PM',
        type: 'networking'
      },
      // Additional events spread across the week
      {
        id: '6',
        title: 'Research Lab Meeting',
        date: new Date(monday),
        time: '2:00 PM',
        type: 'research'
      },
      {
        id: '7',
        title: 'Student Club Fair',
        date: new Date(monday.setDate(monday.getDate() + 2)),
        time: '1:00 PM',
        type: 'student'
      },
      {
        id: '8',
        title: 'Faculty Meeting',
        date: new Date(monday.setDate(monday.getDate() + 3)),
        time: '9:00 AM',
        type: 'academic'
      },
      {
        id: '9',
        title: 'Career Workshop',
        date: new Date(monday.setDate(monday.getDate() + 2)),
        time: '4:00 PM',
        type: 'networking'
      },
      {
        id: '10',
        title: 'Thesis Defense',
        date: new Date(monday.setDate(monday.getDate() + 1)),
        time: '10:30 AM',
        type: 'academic'
      }
    ];
    return events;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch weekly events.');
  }
}

export async function fetchTodayBirthdays() {
  try {
    const birthdays: Birthday[] = [
      {
        id: '1',
        name: 'Aigerim Kazakhbayeva',
        date: '1990-11-18',
        department: 'SSH',
        position: 'Associate Professor'
      },
      {
        id: '2',
        name: 'Daniel Kim',
        date: '1988-11-18',
        department: 'SEng',
        position: 'Professor'
      },
      {
        id: '3',
        name: 'Madina Nurzhanova',
        date: '1993-11-18',
        department: 'SMG',
        position: 'Student'
      },
      {
        id: '4',
        name: 'Alexander Lee',
        date: '1985-11-18',
        department: 'GSB',
        position: 'Staff'
      },
      {
        id: '5',
        name: 'Laura Chen',
        date: '1991-11-18',
        department: 'NUSOM',
        position: 'Assistant Professor'
      },
      {
        id: '6',
        name: 'Azamat Nurlan',
        date: '1995-11-18',
        department: 'SSH',
        position: 'Student'
      }
    ];
    return birthdays;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch today\'s birthdays.');
  }
}
