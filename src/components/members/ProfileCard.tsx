'use client';

import type { Profile } from '@/lib/supabase/types';

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(v: string | null | undefined): string {
  return v?.trim() || '—';
}

function fmtDate(v: string | null | undefined): string {
  if (!v) return '—';
  try { return new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return v; }
}

function fmtAge(dob: string | null): string {
  if (!dob) return '—';
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  return `${age} years`;
}

function cap(s: string | null | undefined): string {
  if (!s) return '—';
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ── Small sub-components ─────────────────────────────────────────────────────
function SectionHead({ label }: { label: string }) {
  return (
    <div style={{ backgroundColor: '#0d9488', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', marginTop: 12, marginBottom: 6 }}>
      {label}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '3px 12px' }}>
      <span style={{ width: 130, fontSize: 9, color: '#6b7280', fontWeight: 600, flexShrink: 0, paddingTop: 1 }}>{label}</span>
      <span style={{ flex: 1, fontSize: 9.5, color: '#111827', fontWeight: value === '—' ? 400 : 500 }}>{value}</span>
    </div>
  );
}

function HalfRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '3px 12px', borderBottom: '1px solid #e5e7eb' }}>
      <span style={{ fontSize: 8, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: 9.5, color: '#111827', fontWeight: value === '—' ? 400 : 500, marginTop: 1 }}>{value}</span>
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────
type Props = { profile: Profile; cardRef: React.RefObject<HTMLDivElement> };

export default function ProfileCard({ profile: p, cardRef }: Props) {
  const issued = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div
      ref={cardRef}
      id="profile-card-root"
      style={{
        width: 560,
        minHeight: 794,
        backgroundColor: '#FFFBF0',
        fontFamily: '"Segoe UI", Arial, sans-serif',
        position: 'relative',
        border: '1px solid #d1d5db',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Teal header band ── */}
      <div style={{ backgroundColor: '#0f766e', padding: '16px 20px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="NYT Logo" width={52} height={52}
             style={{ borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: '#FCD34D', fontSize: 13, fontWeight: 800, letterSpacing: '0.02em', lineHeight: 1.2 }}>
            NIBEDITA YOGA TRAINING CENTRE
          </div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 8.5, marginTop: 2, letterSpacing: '0.05em' }}>
            Affiliated to Yoga Association of India · Est. 1982
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 8, marginTop: 1 }}>
            4/1 Pratapaditya Place, Kolkata 700026 · +91 98301 94452
          </div>
        </div>
        {/* Member ID badge */}
        <div style={{ backgroundColor: '#FCD34D', borderRadius: 6, padding: '6px 10px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 7, color: '#78350f', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Member ID</div>
          <div style={{ fontSize: 14, color: '#78350f', fontWeight: 900, letterSpacing: '0.04em', marginTop: 1 }}>
            {p.member_id ?? 'PENDING'}
          </div>
        </div>
      </div>

      {/* ── Amber sub-header ── */}
      <div style={{ backgroundColor: '#F59E0B', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', padding: '4px 0' }}>
        Member Admission Card
      </div>

      {/* ── Photo + name row ── */}
      <div style={{ display: 'flex', gap: 12, padding: '12px 14px 8px', alignItems: 'flex-start' }}>
        {p.photo_url
          ? <img src={p.photo_url} alt="" width={72} height={88}
                 style={{ objectFit: 'cover', borderRadius: 4, border: '2px solid #e5e7eb', flexShrink: 0 }} />
          : <div style={{ width: 72, height: 88, borderRadius: 4, border: '2px dashed #d1d5db', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 22, color: '#d1d5db' }}>👤</span>
            </div>}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#0f766e', lineHeight: 1.2 }}>{fmt(p.full_name)}</div>
          {p.guardian_name && <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>Guardian: {p.guardian_name}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
            {[
              ['Date of Birth', fmtDate(p.date_of_birth)],
              ['Age', fmtAge(p.date_of_birth)],
              ['Gender', cap(p.gender)],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 7, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                <div style={{ fontSize: 9.5, color: '#111827', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              ['Phone', fmt(p.phone)],
              ['Joined', fmtDate(p.joined_date)],
              ['Language', cap(p.preferred_language)],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 7, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
                <div style={{ fontSize: 9.5, color: '#111827', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Personal details ── */}
      <SectionHead label="Personal Details" />
      <Row label="Address" value={fmt(p.address)} />
      <div style={{ display: 'flex' }}>
        <HalfRow label="Occupation"     value={fmt(p.occupation)} />
        <HalfRow label="Marital Status" value={cap(p.marital_status)} />
      </div>
      <div style={{ display: 'flex' }}>
        <HalfRow label="Mother Tongue" value={fmt(p.mother_tongue)} />
        <HalfRow label="Education"     value={fmt(p.education)} />
      </div>
      <Row label="Emergency Contact" value={fmt(p.emergency_contact)} />
      <Row label="Programme Interest" value={fmt(p.course_interest)} />

      {/* ── Physical details ── */}
      <SectionHead label="Physical Details" />
      <div style={{ display: 'flex' }}>
        <HalfRow label="Height" value={p.height_cm ? `${p.height_cm} cm` : '—'} />
        <HalfRow label="Weight" value={p.weight_kg ? `${p.weight_kg} kg` : '—'} />
      </div>
      <div style={{ display: 'flex' }}>
        <HalfRow label="Diet Preference" value={cap(p.diet_preference)} />
        <HalfRow label="Previous Yoga"   value={p.previous_yoga ? 'Yes' : p.previous_yoga === false ? 'No' : '—'} />
      </div>

      {/* ── Health & medical (confidential) ── */}
      <SectionHead label="Health & Medical Information" />
      <Row label="Medical Conditions"      value={fmt(p.medical_conditions)} />
      <Row label="Cardiovascular"          value={fmt(p.cardiovascular_conditions)} />
      <Row label="Therapeutic Ailments"    value={fmt(p.ailments)} />
      <div style={{ display: 'flex' }}>
        <HalfRow label="Doctor Referral"    value={p.doctor_referral ? 'Yes' : p.doctor_referral === false ? 'No' : '—'} />
        <HalfRow label="Naval Assessment"   value={cap(p.naval_assessment_result)} />
      </div>

      {/* ── Issue note ── */}
      <div style={{ padding: '8px 14px', marginTop: 6 }}>
        <div style={{ fontSize: 7.5, color: '#9ca3af' }}>Issued: {issued}</div>
      </div>

      {/* ── Confidential footer ── */}
      <div style={{ backgroundColor: '#0f766e', padding: '7px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Confidential — For School and Member Use Only
        </div>
        <div style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.55)' }}>
          www.nibedita.yoga
        </div>
      </div>

      {/* Padding for footer */}
      <div style={{ height: 32 }} />
    </div>
  );
}
