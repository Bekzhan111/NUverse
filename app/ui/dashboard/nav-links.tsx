'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  NewspaperIcon,
  CalendarIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'News',
    href: '/dashboard/news',
    icon: NewspaperIcon,
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: CalendarIcon,
  },
  {
    name: 'Phonebook',
    href: '/dashboard/phonebook',
    icon: BookOpenIcon,
  },
  // {
  //   name: 'Invoices',
  //   href: '/dashboard/invoices',
  //   icon: DocumentDuplicateIcon,
  // },
  { 
    name: 'Users', 
    href: '/dashboard/users', 
    icon: UserGroupIcon 
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-[#e8eff6] hover:text-[#2a4a62] md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-[#e8eff6] text-[#2a4a62]': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
