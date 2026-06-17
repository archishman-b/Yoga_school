import { requireAuth } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import ProfileForm from '@/components/members/ProfileForm';
import RollOffToggle from '@/components/members/RollOffToggle';
import TestimonialForm from '@/components/members/TestimonialForm';
import { Wifi, Building2, Clock, CheckCircle2, AlertCircle, XCircle, MessageSquareQuote } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'My Profile' };
type Props = { params: { locale: string } };

function FeeStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: any }> = {
    confirmed:           { label: 'Paid',         cls: 'bg-green-50 text-green-700',  icon: CheckCircle2 },
    screenshot_uploaded: { label: 'Under Review',  cls: 'bg-blue-50 text-blue-700',   icon: Clock },
    pending:             { label: 'Due',           cls: 'bg-amber-50 text-amber-700', icon: AlertCircle },
    overdue:             { label: 'Overdue',       cls: 'bg-red-50 text-red-700',     icon: XCircle },
  };
  const { label, cls, icon: Icon } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      <Icon size={11} /> {label}
    </span>
  );
}

export default async function ProfilePage({ params: { locale } }: Props) {
  const { profile } = await requireAuth(locale);
  const supabase = createClient();

  const [{ data: enrollments }, { data: fees }, { data: pauses }, { data: testimonial }] = await Promise.all([
    supabase.from('enrollments').select('*, batches(*)').eq('member_id', profile.id).neq('status', 'cancelled').order('created_at'),
    supabase.from('fee_records').select('*').eq('member_id', profile.id).order('month', { ascending: false }).limit(12),
    supabase.from('enrollment_pauses').select('*').eq('member_id', profile.id).order('paused_at', { ascending: false }),
    supabase.from('testimonials').select('id, body, rating, status').eq('member_id', profile.id).maybeSingle(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Keep your details up to date.</p>
      </div>

      <ProfileForm profile={profile} locale={locale} />

      {/* Enrollments + Roll-off */}
      {enrollments && enrollments.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">My Batches</h2>
            <p className="text-xs text-gray-400 mt-0.5">Roll off if you need a break — your profile and history stay safe.</p>
          </div>
          <div className="divide-y divide-gray-50">
            {enrollments.map((enr: any) => {
              const batch = enr.batches;
              const pauseHistory = (pauses ?? []).filter((p: any) => p.enrollment_id === enr.id);
              return (
                <div key={enr.id} className="px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        {batch?.mode === 'online' ? <Wifi size={17}/> : <Building2 size={17}/>}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{batch?.timing}</p>
                        <p className="text-gray-400 text-xs capitalize">{batch?.mode} · {batch?.days}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        enr.status === 'active' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {enr.status === 'active' ? 'Active' : 'Rolled Off'}
                      </span>
                      <RollOffToggle
                        enrollmentId={enr.id}
                        memberId={profile.id}
                        currentStatus={enr.status}
                        batchName={`${batch?.timing} (${batch?.mode})`}
                      />
                    </div>
                  </div>
                  {pauseHistory.length > 0 && (
                    <div className="ml-12 space-y-1">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Session History</p>
                      {pauseHistory.map((p: any) => (
                        <div key={p.id} className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>
                            Rolled off {new Date(p.paused_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                            {p.resumed_at && ` · Back on ${new Date(p.resumed_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}`}
                            {p.reason && ` · "${p.reason}"`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fee Records */}
      {fees && fees.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Fee Records</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-2 font-medium">Month</th>
                <th className="text-left px-4 py-2 font-medium">Amount</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
                <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Paid On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {fees.map((fee: any) => (
                <tr key={fee.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 font-medium text-gray-800">{fee.month}</td>
                  <td className="px-4 py-3 text-gray-600">₹{fee.amount?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><FeeStatusBadge status={fee.status} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                    {fee.paid_date ? new Date(fee.paid_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Testimonial */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <MessageSquareQuote size={18} className="text-teal-600" />
          <div>
            <h2 className="font-semibold text-gray-900">Share Your Experience</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {testimonial ? 'Edit your testimonial below.' : 'Your words help others find their yoga journey.'}
            </p>
          </div>
        </div>
        <div className="px-6 py-5">
          <TestimonialForm memberId={profile.id} existing={testimonial} />
        </div>
      </div>
    </div>
  );
}
