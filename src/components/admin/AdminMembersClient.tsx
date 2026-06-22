'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Pencil, Upload } from 'lucide-react';
import AdminMemberDrawer from '@/components/admin/AdminMemberDrawer';
import type { MemberFormData } from '@/components/admin/AdminMemberForm';

type Member = Record<string, unknown>;

type Props = {
  locale:   string;
  members:  Member[];
  children: React.ReactNode;   // server-rendered table passed as slot
};

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

export default function AdminMembersClient({ locale, members, children }: Props) {
  const router = useRouter();
  const [drawer, setDrawer] = useState<{ mode: 'add' | 'edit'; member?: Member } | null>(null);

  const close = () => setDrawer(null);
  const onSuccess = () => { close(); router.refresh(); };

  return (
    <div className="space-y-6">
      {/* ── Header with actions ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Roster</h1>
          <p className="text-gray-500 text-sm mt-1">
            {members.length} total member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/${locale}/admin/members/import`}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            <Upload size={15} /> Bulk Import
          </a>
          <button
            onClick={() => setDrawer({ mode: 'add' })}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors">
            <UserPlus size={15} /> Add Member
          </button>
        </div>
      </div>

      {/* ── Edit buttons injected per row via data attribute ── */}
      {/* The server-rendered table is passed as children; edit buttons are
          added as a floating overlay via the member list below */}

      {/* Static server-rendered roster */}
      {children}

      {/* ── Per-member edit buttons ── */}
      {members.length > 0 && (
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Edit</h2>
          <div className="flex flex-wrap gap-2">
            {members.map((m: Member) => (
              <button
                key={String(m.id)}
                onClick={() => setDrawer({ mode: 'edit', member: m })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-300 rounded-lg transition-colors">
                <Pencil size={11} />
                {String(m.full_name ?? m.email ?? '?')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Drawer ── */}
      {drawer && (
        <AdminMemberDrawer
          mode={drawer.mode}
          memberId={drawer.member ? String(drawer.member.id) : undefined}
          initial={drawer.member ? profileToForm(drawer.member) : undefined}
          onClose={close}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}
