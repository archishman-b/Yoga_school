import { createClient } from '@/lib/supabase/server';
import ApproveToggle from '@/components/admin/ApproveToggle';
import AdminMembersClient from '@/components/admin/AdminMembersClient';
import { AlertTriangle } from 'lucide-react';

type Props = { params: { locale: string } };

function FeePill({ status }: { status?: string }) {
  if (!status) return <span className="text-gray-300 text-xs">—</span>;
  const map: Record<string, string> = {
    confirmed:           'bg-green-50 text-green-700',
    screenshot_uploaded: 'bg-blue-50 text-blue-700',
    pending:             'bg-amber-50 text-amber-700',
    overdue:             'bg-red-50 text-red-700',
  };
  const labels: Record<string, string> = {
    confirmed: 'Paid', screenshot_uploaded: 'Review', pending: 'Due', overdue: 'Overdue',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-50 text-gray-500'}`}>
      {labels[status] ?? status}
    </span>
  );
}

export default async function AdminMembersPage({ params: { locale } }: Props) {
  const supabase = createClient();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data: members } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'member')
    .order('full_name');

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, batches(id, timing, mode, batch_code)')
    .neq('status', 'cancelled');

  const { data: feeRecords } = await supabase
    .from('fee_records')
    .select('*')
    .eq('month', currentMonth);

  const enrollmentsByMember = new Map<string, any[]>();
  for (const e of enrollments ?? []) {
    if (!enrollmentsByMember.has(e.member_id)) enrollmentsByMember.set(e.member_id, []);
    enrollmentsByMember.get(e.member_id)!.push(e);
  }
  const feeByMember = new Map<string, any>();
  for (const f of feeRecords ?? []) feeByMember.set(f.member_id, f);

  const memberList = members ?? [];

  return (
    <AdminMembersClient locale={locale} members={memberList}>

      {/* ── Member table (server-rendered) ── */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-medium">Member</th>
              <th className="text-left px-4 py-3 font-medium">ID</th>
              <th className="text-left px-4 py-3 font-medium">Gender / Age</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-left px-4 py-3 font-medium">Batches</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
              <th className="text-center px-4 py-3 font-medium">Fee {currentMonth}</th>
              <th className="text-center px-4 py-3 font-medium">Health</th>
              <th className="text-center px-4 py-3 font-medium">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {memberList.map((m: any) => {
              const memberEnrolments = enrollmentsByMember.get(m.id) ?? [];
              const hasActive = memberEnrolments.some((e: any) => e.status === 'active');
              const fee = feeByMember.get(m.id);
              const age = m.date_of_birth
                ? Math.floor((Date.now() - new Date(m.date_of_birth).getTime()) / (365.25*24*60*60*1000))
                : null;
              const genderLabel: Record<string, string> = {
                male: 'M', female: 'F', other: 'O', prefer_not_to_say: '—',
              };

              return (
                <tr key={m.id} className={`hover:bg-gray-50/50 transition-colors ${!hasActive ? 'opacity-60' : ''}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      {m.photo_url
                        ? <img src={m.photo_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0"/>
                        : <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {(m.full_name ?? m.email ?? '?')[0].toUpperCase()}
                          </div>}
                      <div>
                        <p className="font-medium text-gray-900 text-sm leading-snug">{m.full_name ?? '—'}</p>
                        <p className="text-gray-400 text-xs">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {m.member_id
                      ? <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{m.member_id}</span>
                      : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {genderLabel[m.gender] ?? '—'} {age !== null ? `· ${age}y` : ''}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{m.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {memberEnrolments.length === 0
                        ? <span className="text-gray-300 text-xs">None</span>
                        : memberEnrolments.map((e: any) => (
                          <span key={e.id} className={`px-1.5 py-0.5 rounded text-xs font-mono font-medium ${
                            e.status === 'active' ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-400 line-through'
                          }`}>
                            {e.batches?.batch_code ?? e.batches?.timing ?? '—'}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {m.joined_date ? new Date(m.joined_date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' }) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center"><FeePill status={fee?.status} /></td>
                  <td className="px-4 py-3 text-center">
                    {(m.medical_conditions || m.cardiovascular_conditions || m.doctor_referral)
                      ? <span title={[m.medical_conditions, m.cardiovascular_conditions].filter(Boolean).join(' · ')}
                              className="inline-flex items-center gap-1 text-amber-600 cursor-help">
                          <AlertTriangle size={14} />
                        </span>
                      : <span className="text-gray-200 text-xs">✓</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ApproveToggle memberId={m.id} currentStatus={m.status ?? 'active'} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {memberList.length === 0 && (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No members yet. Use "Add Member" or "Bulk Import" to get started.</p>
        )}
      </div>

      {/* ── Health information panel ── */}
      {memberList.some((m: any) => m.medical_conditions || m.cardiovascular_conditions || m.ailments || m.doctor_referral) && (
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" /> Health Information on File
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left pb-2 pr-4 font-medium">Member</th>
                  <th className="text-left pb-2 pr-4 font-medium">ID</th>
                  <th className="text-left pb-2 pr-4 font-medium">Health Conditions</th>
                  <th className="text-left pb-2 pr-4 font-medium">Cardiovascular</th>
                  <th className="text-center pb-2 pr-4 font-medium">Dr. Ref.</th>
                  <th className="text-center pb-2 pr-4 font-medium">Prev. Yoga</th>
                  <th className="text-left pb-2 pr-4 font-medium">Therapeutic Ailments</th>
                  <th className="text-left pb-2 font-medium">Naval Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {memberList
                  .filter((m: any) => m.medical_conditions || m.cardiovascular_conditions || m.ailments || m.doctor_referral)
                  .map((m: any) => (
                  <tr key={m.id} className="hover:bg-gray-50/50">
                    <td className="py-2.5 pr-4 font-medium text-gray-800 w-36">{m.full_name ?? m.email}</td>
                    <td className="py-2.5 pr-4">
                      {m.member_id
                        ? <span className="font-mono text-xs text-teal-700">{m.member_id}</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500 text-xs max-w-[160px]">{m.medical_conditions ?? '—'}</td>
                    <td className="py-2.5 pr-4 text-xs">
                      {m.cardiovascular_conditions
                        ? <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded">{m.cardiovascular_conditions}</span>
                        : '—'}
                    </td>
                    <td className="py-2.5 pr-4 text-center text-xs">{m.doctor_referral ? '✅' : '—'}</td>
                    <td className="py-2.5 pr-4 text-center text-xs">{m.previous_yoga ? '✅' : '—'}</td>
                    <td className="py-2.5 pr-4 text-gray-500 text-xs max-w-[160px]">{m.ailments ?? '—'}</td>
                    <td className="py-2.5 text-xs">
                      {m.naval_assessment_result
                        ? <span className={`px-1.5 py-0.5 rounded font-medium ${m.naval_assessment_result === 'displaced' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                            {m.naval_assessment_result}
                          </span>
                        : <span className="text-gray-300 italic">Pending</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </AdminMembersClient>
  );
}
