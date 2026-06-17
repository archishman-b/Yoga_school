import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, CalendarDays, IndianRupee, MessageSquare, Megaphone, Quote, TrendingUp, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Dashboard' };
type Props = { params: { locale: string } };

export default async function AdminOverviewPage({ params: { locale } }: Props) {
  await requireAdmin(locale);
  const supabase = createClient();

  const [
    { count: totalMembers },
    { count: activeMembers },
    { count: newEnquiries },
    { count: pendingFees },
    { count: pendingTestimonials },
    { data: batches },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'member'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('fee_records').select('*', { count: 'exact', head: true }).in('status', ['pending', 'overdue']),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('batches').select('id, timing, mode, display_fill_pct, status').eq('status', 'active'),
  ]);

  const stats = [
    { label: 'Total Members',       value: totalMembers ?? 0,       icon: Users,       href: 'members',      color: 'teal' },
    { label: 'Active Enrollments',  value: activeMembers ?? 0,      icon: CalendarDays, href: 'batches',     color: 'teal' },
    { label: 'New Enquiries',       value: newEnquiries ?? 0,       icon: MessageSquare, href: 'enquiries',  color: 'amber', alert: (newEnquiries ?? 0) > 0 },
    { label: 'Pending Fees',        value: pendingFees ?? 0,        icon: IndianRupee, href: 'fees',         color: 'red',   alert: (pendingFees ?? 0) > 0 },
    { label: 'Testimonials to Review', value: pendingTestimonials ?? 0, icon: Quote,  href: 'testimonials', color: 'amber', alert: (pendingTestimonials ?? 0) > 0 },
  ];

  const colorMap: Record<string, string> = {
    teal:  'bg-teal-50 text-teal-600',
    amber: 'bg-amber-50 text-amber-600',
    red:   'bg-red-50 text-red-600',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Nibedita Yoga Training Centre — admin overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color, alert }) => (
          <Link key={href} href={`/${locale}/admin/${href}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
                <Icon size={19} />
              </div>
              {alert && <AlertCircle size={15} className="text-amber-500" />}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5 group-hover:text-teal-600 transition-colors">{label}</p>
          </Link>
        ))}
      </div>

      {/* Batch fill quick-view */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900">Batch Fill Overview</h2>
          <Link href={`/${locale}/admin/batches`} className="text-xs text-teal-600 hover:text-teal-700 font-medium">
            Manage →
          </Link>
        </div>
        <div className="space-y-2.5">
          {(batches ?? []).map((b: any) => {
            const pct = b.display_fill_pct ?? 0;
            const color = pct <= 25 ? 'bg-green-500' : pct <= 55 ? 'bg-teal-500' : pct <= 80 ? 'bg-amber-500' : 'bg-red-500';
            const label = pct <= 25 ? 'Open' : pct <= 55 ? 'Filling Up' : pct <= 80 ? 'Almost Full' : 'Full';
            return (
              <div key={b.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-40 shrink-0 truncate">{b.timing} ({b.mode})</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-20 text-right shrink-0">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: 'events',  icon: Megaphone, label: 'Manage Events', desc: 'Post updates, workshops, media' },
          { href: 'fees',    icon: IndianRupee, label: 'Fee Records', desc: 'Confirm payments, mark overdue' },
          { href: 'enquiries', icon: MessageSquare, label: 'Enquiries', desc: 'Respond to new enquiries' },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={`/${locale}/admin/${href}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
              <Icon size={19} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
