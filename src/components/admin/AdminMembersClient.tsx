'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Upload, Pencil, Trash2, AlertTriangle, Search, X } from 'lucide-react';
import AdminMemberDrawer from '@/components/admin/AdminMemberDrawer';
import ApproveToggle from '@/components/admin/ApproveToggle';
import type { MemberFormData } from '@/components/admin/AdminMemberForm';

// ── Types ────────────────────────────────────────────────────────────────────
type Member     = Record<string, unknown>;
type Enrollment = { id: string; member_id: string; status: string; batches?: { batch_code?: string; timing?: string } };
type FeeRecord  = { member_id: string; status?: string };

type Props = {
  locale:      string;
  members:     Member[];
  enrollments: Enrollment[];
  fees:        FeeRecord[];
  currentMonth: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
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

function profileToForm(m: Member): Partial<MemberFormData> {
  const str = (v: unknown) => (v != null ? String(v) : '');
  return {
    full_name:                str(m.full_name),
    phone:                    str(m.phone),
    gender:                   str(m.gender),
    date_of_birth:            str(m.date_of_birth),
    guardian_name:            str(m.guardian_name),
    address:                  str(m.address),
    occupation:               str(m.occupation),
    marital_status:           str(m.marital_status),
    mother_tongue:            str(m.mother_tongue),
    education:                str(m.education),
    height_cm:                m.height_cm != null ? String(m.height_cm) : '',
    weight_kg:                m.weight_kg != null ? String(m.weight_kg) : '',
    diet_preference:          str(m.diet_preference),
    emergency_contact:        str(m.emergency_contact),
    preferred_language:       str(m.preferred_language) || 'en',
    joined_date:              str(m.joined_date),
    course_interest:          str(m.course_interest),
    medical_conditions:       str(m.medical_conditions),
    cardiovascular_conditions: str(m.cardiovascular_conditions),
    previous_yoga:            Boolean(m.previous_yoga),
    doctor_referral:          Boolean(m.doctor_referral),
    ailments:                 str(m.ailments),
    naval_assessment_result:  str(m.naval_assessment_result),
  };
}

// ── Main component ───────────────────────────────────────────────────────────
export default function AdminMembersClient({ locale, members, enrollments, fees, currentMonth }: Props) {
  const router = useRouter();

  // ── Search ──────────────────────────────────────────────────────────────
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(m => {
      const name  = String(m.full_name ?? '').toLowerCase();
      const phone = String(m.phone ?? '').replace(/\D/g, '');
      const qNum  = q.replace(/\D/g, '');
      return name.includes(q) || (qNum && phone.includes(qNum));
    });
  }, [members, query]);

  // ── Drawer ──────────────────────────────────────────────────────────────
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; member?: Member } | null>(null);
  const closeDrawer = () => setDrawer(null);
  const onSaved = () => { closeDrawer(); router.refresh(); };

  // ── Delete confirm state ─────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null); // member id
  const [deleting,      setDeleting]      = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res  = await fetch('/api/admin/delete-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setDeleting(null);
    setConfirmDelete(null);
    if (res.ok) router.refresh();
    else {
      const data = await res.json();
      alert(`Delete failed: ${data.error}`);
    }
  };

  // ── Build lookup maps ────────────────────────────────────────────────────
  const enrollmentsByMember = useMemo(() => {
    const map = new Map<string, Enrollment[]>();
    for (const e of enrollments) {
      if (!map.has(e.member_id)) map.set(e.member_id, []);
      map.get(e.member_id)!.push(e);
    }
    return map;
  }, [enrollments]);

  const feeByMember = useMemo(() => {
    const map = new Map<string, FeeRecord>();
    for (const f of fees) map.set(f.member_id, f);
    return map;
  }, [fees]);

  const genderLabel: Record<string, string> = { male: 'M', female: 'F', other: 'O', prefer_not_to_say: '—' };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Roster</h1>
          <p className="text-gray-500 text-sm mt-1">
            {members.length} total{filtered.length !== members.length ? ` · ${filtered.length} shown` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a href={`/${locale}/admin/members/import`}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            <Upload size={15} /> Bulk Import
          </a>
          <button onClick={() => setDrawer({ mode: 'add' })}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors">
            <UserPlus size={15} /> Add Member
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or phone…"
          className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 transition-colors bg-white"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Member table ── */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
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
              <th className="text-center px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((m) => {
              const id              = String(m.id);
              const memberEnrolments = enrollmentsByMember.get(id) ?? [];
              const fee             = feeByMember.get(id);
              const age             = m.date_of_birth
                ? Math.floor((Date.now() - new Date(String(m.date_of_birth)).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                : null;
              const isConfirming = confirmDelete === id;
              const isDeleting   = deleting === id;

              return (
                <tr key={id} className={`hover:bg-gray-50/50 transition-colors ${m.status === 'suspended' ? 'opacity-50' : ''}`}>
                  {/* Name */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      {m.photo_url
                        ? <img src={String(m.photo_url)} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        : <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {(String(m.full_name ?? m.email ?? '?'))[0].toUpperCase()}
                          </div>}
                      <div>
                        <p className="font-medium text-gray-900 text-sm leading-snug">{String(m.full_name ?? '—')}</p>
                        <p className="text-gray-400 text-xs">{String(m.email ?? '')}</p>
                      </div>
                    </div>
                  </td>
                  {/* Member ID */}
                  <td className="px-4 py-3">
                    {m.member_id
                      ? <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{String(m.member_id)}</span>
                      : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  {/* Gender / Age */}
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {genderLabel[String(m.gender)] ?? '—'} {age !== null ? `· ${age}y` : ''}
                  </td>
                  {/* Phone */}
                  <td className="px-4 py-3 text-gray-500 text-xs">{String(m.phone ?? '—')}</td>
                  {/* Batches */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {memberEnrolments.length === 0
                        ? <span className="text-gray-300 text-xs">None</span>
                        : memberEnrolments.map(e => (
                          <span key={e.id} className={`px-1.5 py-0.5 rounded text-xs font-mono font-medium ${
                            e.status === 'active' ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-400 line-through'
                          }`}>
                            {e.batches?.batch_code ?? e.batches?.timing ?? '—'}
                          </span>
                        ))}
                    </div>
                  </td>
                  {/* Joined */}
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {m.joined_date ? new Date(String(m.joined_date)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                  </td>
                  {/* Fee */}
                  <td className="px-4 py-3 text-center"><FeePill status={fee?.status} /></td>
                  {/* Health */}
                  <td className="px-4 py-3 text-center">
                    {(m.medical_conditions || m.cardiovascular_conditions || m.doctor_referral)
                      ? <span title={[m.medical_conditions, m.cardiovascular_conditions].filter(Boolean).join(' · ')}
                              className="inline-flex items-center gap-1 text-amber-600 cursor-help">
                          <AlertTriangle size={14} />
                        </span>
                      : <span className="text-gray-200 text-xs">✓</span>}
                  </td>
                  {/* Active toggle */}
                  <td className="px-4 py-3 text-center">
                    <ApproveToggle memberId={id} currentStatus={String(m.status ?? 'active')} />
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {/* Edit */}
                      <button
                        onClick={() => setDrawer({ mode: 'edit', member: m })}
                        title="Edit member"
                        className="p-1.5 text-gray-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors">
                        <Pencil size={14} />
                      </button>

                      {/* Delete — two-step confirm */}
                      {!isConfirming && !isDeleting && (
                        <button
                          onClick={() => setConfirmDelete(id)}
                          title="Delete member"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                      {isConfirming && !isDeleting && (
                        <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                          <span className="text-xs text-red-700 font-semibold whitespace-nowrap">Delete?</span>
                          <button
                            onClick={() => handleDelete(id)}
                            className="text-xs font-bold text-red-700 hover:text-red-900 px-1">Yes</button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs text-gray-500 hover:text-gray-700 px-1">No</button>
                        </div>
                      )}
                      {isDeleting && (
                        <span className="text-xs text-red-500 px-2">Deleting…</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">
            {query ? `No members match "${query}"` : 'No members yet. Use "Add Member" or "Bulk Import" to get started.'}
          </p>
        )}
      </div>

      {/* ── Health panel ── */}
      {members.some(m => m.medical_conditions || m.cardiovascular_conditions || m.ailments || m.doctor_referral) && (
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" /> Health Information on File
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
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
                {members
                  .filter(m => m.medical_conditions || m.cardiovascular_conditions || m.ailments || m.doctor_referral)
                  .map(m => (
                  <tr key={String(m.id)} className="hover:bg-gray-50/50">
                    <td className="py-2.5 pr-4 font-medium text-gray-800 w-36">{String(m.full_name ?? m.email ?? '—')}</td>
                    <td className="py-2.5 pr-4">
                      {m.member_id
                        ? <span className="font-mono text-xs text-teal-700">{String(m.member_id)}</span>
                        : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-500 text-xs max-w-[160px]">{String(m.medical_conditions ?? '—')}</td>
                    <td className="py-2.5 pr-4 text-xs">
                      {m.cardiovascular_conditions
                        ? <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded">{String(m.cardiovascular_conditions)}</span>
                        : '—'}
                    </td>
                    <td className="py-2.5 pr-4 text-center text-xs">{m.doctor_referral ? '✅' : '—'}</td>
                    <td className="py-2.5 pr-4 text-center text-xs">{m.previous_yoga ? '✅' : '—'}</td>
                    <td className="py-2.5 pr-4 text-gray-500 text-xs max-w-[160px]">{String(m.ailments ?? '—')}</td>
                    <td className="py-2.5 text-xs">
                      {m.naval_assessment_result
                        ? <span className={`px-1.5 py-0.5 rounded font-medium ${m.naval_assessment_result === 'displaced' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                            {String(m.naval_assessment_result)}
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

      {/* ── Drawer ── */}
      {drawer && (
        <AdminMemberDrawer
          mode={drawer.mode}
          memberId={drawer.member ? String(drawer.member.id) : undefined}
          initial={drawer.member ? profileToForm(drawer.member) : undefined}
          onClose={closeDrawer}
          onSuccess={onSaved}
        />
      )}
    </div>
  );
}
