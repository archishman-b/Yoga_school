'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, CalendarDays, IndianRupee, MessageSquare, Megaphone, Quote, LayoutDashboard, BookOpen } from 'lucide-react';

type Props = { locale: string };

const links = [
  { href: '/admin',              label: 'Overview',      icon: LayoutDashboard },
  { href: '/admin/members',      label: 'Members',       icon: Users },
  { href: '/admin/batches',      label: 'Batches',       icon: CalendarDays },
  { href: '/admin/fees',         label: 'Fees',          icon: IndianRupee },
  { href: '/admin/enquiries',    label: 'Enquiries',     icon: MessageSquare },
  { href: '/admin/events',       label: 'Events',        icon: Megaphone },
  { href: '/admin/testimonials', label: 'Testimonials',  icon: Quote },
  { href: '/admin/programmes',   label: 'Programmes',    icon: BookOpen },
];

export default function AdminNav({ locale }: Props) {
  const path = usePathname();
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2">
        <span className="text-sm font-semibold text-gray-400 mr-3 shrink-0">Admin</span>
        {links.map(({ href, label, icon: Icon }) => {
          const full = `/${locale}${href}`;
          const active = path === full || (href !== '/admin' && path.startsWith(full));
          return (
            <Link
              key={href}
              href={full}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
