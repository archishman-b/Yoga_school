'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { User, CalendarDays, CreditCard, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = { locale: string };

export default function MemberSidebar({ locale }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: `/${locale}/members`, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: `/${locale}/members/profile`, label: 'My Profile', icon: <User size={18} /> },
    { href: `/${locale}/members/batches`, label: 'My Batches', icon: <CalendarDays size={18} /> },
    { href: `/${locale}/members/fees`, label: 'Fee Records', icon: <CreditCard size={18} /> },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/members/login`);
    router.refresh();
  };

  return (
    <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 bg-gradient-to-br from-teal-700 to-teal-900 text-white">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
          <div>
            <p className="font-semibold text-sm">Member Portal</p>
            <p className="text-teal-300 text-xs">Nibedita Yoga Training Centre</p>
          </div>
        </div>
      </div>

      <ul className="p-2 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-50',
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="p-2 border-t border-gray-100 mt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
