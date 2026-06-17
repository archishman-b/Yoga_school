import { createClient } from '@/lib/supabase/server';
import { Users, CalendarDays, Receipt, Inbox } from 'lucide-react';
import Link from 'next/link';

type Props = { params: { locale: string } };

async function stat(supabase: any, table: string, filter?: Record<string, string>) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filter) {
    for (const [k, v] of Object.entries(filter)) q = q.eq(k, v);
  }
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminDashboardPage({ params: { locale } }: Props) {
  const supabase = createClient();

  const [totalMembers, activeEnrolled, pendingFees, openEnquiries] = await Promise.all([
    stat(supabase, 'profiles', { role: 'member' }),
    stat(supabase, 'enrollments', { status: 'active' }),
    stat(supabase, 'fee_records', { status: 'pending' }),
    stat(supabase, 'enquiries', { status: 'new' }),
  ]);

  // Recent enquiries
  const { data: recentEnquiries } = await supabase
    .from('enquiries')
    .select('*')
    .eq('status', 'new')
    .order('created_at', { ascending: false })
    .limit(5);

  // Fees awaiting confirmation
  const { data: awaitingFees } = await supabase
    .from('fee_records')
    .select('*, profiles(full_name, email)')
    .eq('status', 'screenshot_uploaded')
    .order('updated_at', { ascending: false })
    .limit(5);

  const base = `/${locale}/admin`;

  const CARDS = [
    { label: 'Total Members', value: totalMembers, icon: Users, href: `${base}/members`, colour: 'bg-teal-50 text-teal-600' },
    { label: 'Active Enrollments', value: activeEnrolled, icon: CalendarDays, href: `${base}/batches`, colour: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Fees', value: pendingFees, icon: Receipt, href: `${base}/fees`, colour: 'bg-saffron-50 text-saffron-600' },
    { label: 'Open Enquiries', value: openEnquiries, icon: Inbox, href: `${base}/enquiries`, colour: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">School overview at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ label, value, icon: Icon, href, colour }) => (
          <Link key={label} href={href} className="card p-5 hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colour}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Awaiting fee confirmation */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Fees Awaiting Confirmation</h2>
            <Link href={`${base}/fees`} className="text-xs text-teal-600 hover:underline">View all</Link>
          </div>
          {awaitingFees && awaitingFees.length > 0 ? (
            <ul className="divide-y divide-gray-50">
              {awaitingFees.map((fee: any) => (
                <li key={fee.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{fee.profiles?.full_name ?? fee.profiles?.email ?? '—'}</p>
                    <p className="text-xs text-gray-400">{fee.month} · ₹{fee.amount?.toLocaleString('en-IN')}</p>
                  </div>
                  {fee.screenshot_url && (
                    <a href={fee.screenshot_url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-teal-600 underline">
                      View
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-gray-400">All clear — no fees pending confirmation.</p>
          )}
        </div>

        {/* Recent enquiries */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">New Enquiries</h2>
            <Link href={`${base}/enquiries`} className="text-xs text-teal-600 hover:underline">View all</Link>
          </div>
          {recentEnquiries && recentEnquiries.length > 0 ? (
            <ul className="divide-y divide-gray-50">
              {recentEnquiries.map((enq: any) => (
                <li key={enq.id} className="px-5 py-3">
                  <p className="text-sm font-medium text-gray-900">{enq.name}</p>
                  <p className="text-xs text-gray-400">{enq.phone} · {enq.preferred_time}</p>
                  {enq.message && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{enq.message}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-6 text-sm text-gray-400">No new enquiries.</p>
          )}
        </div>
      </div>
    </div>
  );
}
