'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, CalendarDays, Receipt,
  Inbox, Megaphone, LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const NAV = [
  { href: '', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/members',   label: 'Members',    icon: Users },
  { href: '/batches',   label: 'Batches',    icon: CalendarDays },
  { href: '/fees',      label: 'Fees',       icon: Receipt },
  { href: '/enquiries', label: 'Enquiries',  icon: Inbox },
  { href: '/events',    label: 'Events',     icon: Megaphone },
];

export default function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router   = useRouter();
  const base     = `/${locale}/admin`;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col min-h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Admin</span>
        <p className="font-bold text-gray-900 text-sm mt-0.5">Nibedita Yoga Training Centre</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const fullHref = `${base}${href}`;
          const active   = href === '' ? pathname === base : pathname.startsWith(fullHref);
          return (
            <Link
              key={href}
              href={fullHref}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-saffron-50 text-saffron-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
