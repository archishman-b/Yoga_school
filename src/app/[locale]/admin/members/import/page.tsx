'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, Download, CheckCircle2, XCircle, Loader2, ArrowLeft, Copy, Check } from 'lucide-react';

type Props = { params: { locale: string } };

// ── CSV template columns (must match create-member route fields) ─────────────
const TEMPLATE_HEADERS = [
  'full_name',          // required
  'phone',
  'gender',             // male | female | other | prefer_not_to_say
  'date_of_birth',      // YYYY-MM-DD
  'guardian_name',
  'address',
  'occupation',
  'marital_status',     // single | married | widowed | divorced | other
  'mother_tongue',
  'education',
  'height_cm',
  'weight_kg',
  'diet_preference',    // vegetarian | non-vegetarian | vegan | other
  'medical_conditions',
  'cardiovascular_conditions',
  'previous_yoga',      // yes | no
  'doctor_referral',    // yes | no
  'ailments',
  'course_interest',
  'emergency_contact',
  'joined_date',        // YYYY-MM-DD (leave blank for today)
  'preferred_language', // en | hi | bn
];

const EXAMPLE_ROWS = [
  [
    'Sunita Sharma', '9876543210', 'female', '1972-05-14', 'Ramesh Sharma',
    '12 Park Street Kolkata 700016', 'Homemaker', 'married', 'Bengali', 'Graduate',
    '158', '62', 'vegetarian', 'Type 2 diabetes', '', 'no', 'no',
    'Lower back pain, knee stiffness', 'weight-management', '9830000001', '2024-01-15', 'bn',
  ],
  [
    'Priya Gupta', '8765432109', 'female', '1980-11-03', '',
    '45 Lake Road Kolkata 700029', 'Teacher', 'married', 'Hindi', 'Post Graduate',
    '162', '55', 'vegetarian', '', '', 'yes', 'no',
    '', 'anti-ageing', '9830000002', '', 'hi',
  ],
];

// ── Parse CSV text → array of objects ───────────────────────────────────────
function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    // Simple CSV split (handles quoted fields with commas inside)
    const vals: string[] = [];
    let cur = '';
    let inQuote = false;
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { vals.push(cur); cur = ''; continue; }
      cur += ch;
    }
    vals.push(cur);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = (vals[i] ?? '').trim(); });
    return obj;
  });
}

// ── Download helper ──────────────────────────────────────────────────────────
function downloadCsv(filename: string, rows: string[][]) {
  const csvContent = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

type RowResult = {
  row: Record<string, string>;
  status: 'pending' | 'success' | 'error';
  member_id?: string;
  password?: string;
  error?: string;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="ml-1 text-gray-400 hover:text-teal-600 transition-colors">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  );
}

export default function ImportMembersPage({ params: { locale } }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows,       setRows]       = useState<Record<string, string>[]>([]);
  const [results,    setResults]    = useState<RowResult[]>([]);
  const [importing,  setImporting]  = useState(false);
  const [parseError, setParseError] = useState('');
  const [done,       setDone]       = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError(''); setResults([]); setDone(false);
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = parseCsv(ev.target?.result as string);
        if (parsed.length === 0) { setParseError('CSV is empty or has no data rows.'); return; }
        const missing = parsed.filter(r => !r.full_name?.trim());
        if (missing.length > 0) {
          setParseError(`${missing.length} row(s) are missing full_name (required).`);
          return;
        }
        setRows(parsed);
      } catch {
        setParseError('Could not parse the CSV. Make sure it uses the template format.');
      }
    };
    reader.readAsText(file);
  };

  const runImport = async () => {
    if (rows.length === 0) return;
    setImporting(true);
    setDone(false);

    const initial: RowResult[] = rows.map(r => ({ row: r, status: 'pending' }));
    setResults(initial);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Coerce boolean fields
      const payload: Record<string, unknown> = { ...row };
      payload.previous_yoga   = row.previous_yoga?.toLowerCase() === 'yes';
      payload.doctor_referral = row.doctor_referral?.toLowerCase() === 'yes';
      payload.height_cm = row.height_cm ? parseFloat(row.height_cm) : null;
      payload.weight_kg = row.weight_kg ? parseFloat(row.weight_kg) : null;
      if (!payload.joined_date) delete payload.joined_date; // let API default to today
      // Remove empty strings
      Object.keys(payload).forEach(k => { if (payload[k] === '') payload[k] = null; });

      try {
        const res = await fetch('/api/admin/create-member', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setResults(prev => {
          const next = [...prev];
          if (res.ok && data.member_id) {
            next[i] = { row, status: 'success', member_id: data.member_id, password: data.password };
          } else {
            next[i] = { row, status: 'error', error: data.error ?? 'Unknown error' };
          }
          return next;
        });
      } catch (err: unknown) {
        setResults(prev => {
          const next = [...prev];
          next[i] = { row, status: 'error', error: (err as Error).message };
          return next;
        });
      }
    }

    setImporting(false);
    setDone(true);
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount   = results.filter(r => r.status === 'error').length;

  const exportCredentials = () => {
    const successRows = results.filter(r => r.status === 'success');
    const csvRows = [
      ['Name', 'Phone', 'Member ID', 'Temp Password', 'Login URL'],
      ...successRows.map(r => [
        r.row.full_name ?? '',
        r.row.phone ?? '',
        r.member_id ?? '',
        r.password ?? '',
        `${window.location.origin}/${locale}/members/login`,
      ]),
    ];
    downloadCsv('nibedita-member-credentials.csv', csvRows);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/members`}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-700 transition-colors">
          <ArrowLeft size={15} /> Back to Members
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Import Members</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload a CSV to create multiple member accounts at once. Each row gets a unique Member ID and temporary password.
        </p>
      </div>

      {/* ── Step 1: Download template ── */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">1</span>
          Download the template
        </h2>
        <p className="text-sm text-gray-500">
          Fill in the template spreadsheet and save as CSV. Only <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">full_name</code> is required — all other columns are optional.
        </p>
        <button
          onClick={() => downloadCsv('nibedita-member-import-template.csv', [TEMPLATE_HEADERS, ...EXAMPLE_ROWS])}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <Download size={16} /> Download CSV Template
        </button>
        <details className="text-xs text-gray-400 cursor-pointer">
          <summary className="hover:text-gray-600">View column guide</summary>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500">
            <div><code className="bg-gray-50 px-1 rounded">gender</code> — male / female / other / prefer_not_to_say</div>
            <div><code className="bg-gray-50 px-1 rounded">date_of_birth</code> — YYYY-MM-DD</div>
            <div><code className="bg-gray-50 px-1 rounded">marital_status</code> — single / married / widowed / divorced / other</div>
            <div><code className="bg-gray-50 px-1 rounded">diet_preference</code> — vegetarian / non-vegetarian / vegan / other</div>
            <div><code className="bg-gray-50 px-1 rounded">previous_yoga</code> — yes / no</div>
            <div><code className="bg-gray-50 px-1 rounded">doctor_referral</code> — yes / no</div>
            <div><code className="bg-gray-50 px-1 rounded">preferred_language</code> — en / hi / bn</div>
            <div><code className="bg-gray-50 px-1 rounded">joined_date</code> — YYYY-MM-DD (blank = today)</div>
          </div>
        </details>
      </div>

      {/* ── Step 2: Upload CSV ── */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">2</span>
          Upload your filled CSV
        </h2>

        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          rows.length > 0 ? 'border-teal-400 bg-teal-50/40' : 'border-gray-200 bg-gray-50 hover:border-teal-300 hover:bg-teal-50/20'
        }`}>
          <Upload size={24} className={rows.length > 0 ? 'text-teal-500' : 'text-gray-400'} />
          {rows.length > 0
            ? <p className="mt-2 text-sm font-semibold text-teal-700">{rows.length} member{rows.length !== 1 ? 's' : ''} ready to import</p>
            : <p className="mt-2 text-sm text-gray-500">Click to select CSV file</p>}
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>

        {parseError && (
          <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <XCircle size={15} /> {parseError}
          </p>
        )}

        {/* Preview table */}
        {rows.length > 0 && (
          <div className="overflow-x-auto">
            <p className="text-xs text-gray-400 mb-2">Preview — first {Math.min(rows.length, 5)} of {rows.length} rows:</p>
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-3 py-2 font-medium">#</th>
                  <th className="text-left px-3 py-2 font-medium">Name</th>
                  <th className="text-left px-3 py-2 font-medium">Phone</th>
                  <th className="text-left px-3 py-2 font-medium">Gender</th>
                  <th className="text-left px-3 py-2 font-medium">DOB</th>
                  <th className="text-left px-3 py-2 font-medium">Course Interest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.slice(0, 5).map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{r.full_name || '—'}</td>
                    <td className="px-3 py-2 text-gray-500">{r.phone || '—'}</td>
                    <td className="px-3 py-2 text-gray-500">{r.gender || '—'}</td>
                    <td className="px-3 py-2 text-gray-500">{r.date_of_birth || '—'}</td>
                    <td className="px-3 py-2 text-gray-500">{r.course_interest || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 5 && (
              <p className="text-xs text-gray-400 mt-1 px-3">… and {rows.length - 5} more rows.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Step 3: Import ── */}
      {rows.length > 0 && !done && (
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">3</span>
            Create accounts
          </h2>
          <p className="text-sm text-gray-500">
            This will create a login account + profile for each row. Accounts are created one by one — do not close this page.
          </p>
          <button
            onClick={runImport}
            disabled={importing}
            className="flex items-center gap-2 px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
            {importing
              ? <><Loader2 size={16} className="animate-spin" /> Importing…</>
              : <><CheckCircle2 size={16} /> Import {rows.length} Member{rows.length !== 1 ? 's' : ''}</>}
          </button>

          {/* Live progress while importing */}
          {importing && results.length > 0 && (
            <div className="space-y-1">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {r.status === 'pending'  && <Loader2 size={12} className="animate-spin text-gray-400" />}
                  {r.status === 'success'  && <CheckCircle2 size={12} className="text-green-500" />}
                  {r.status === 'error'    && <XCircle size={12} className="text-red-500" />}
                  <span className={r.status === 'error' ? 'text-red-600' : 'text-gray-600'}>
                    {r.row.full_name}
                    {r.status === 'error' ? ` — ${r.error}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Results ── */}
      {done && (
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Import Complete</h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-600 font-semibold">{successCount} created</span>
              {errorCount > 0 && <span className="text-red-600 font-semibold">{errorCount} failed</span>}
            </div>
          </div>

          {successCount > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 font-medium">Generated credentials — share with each member:</p>
                <button onClick={exportCredentials}
                  className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-800 font-semibold border border-teal-200 px-2.5 py-1.5 rounded-lg transition-colors">
                  <Download size={12} /> Export credentials CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                      <th className="text-left px-4 py-2 font-medium">Name</th>
                      <th className="text-left px-4 py-2 font-medium">Phone</th>
                      <th className="text-left px-4 py-2 font-medium">Member ID</th>
                      <th className="text-left px-4 py-2 font-medium">Temp Password</th>
                      <th className="text-center px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {results.map((r, i) => (
                      <tr key={i} className={r.status === 'error' ? 'bg-red-50/50' : ''}>
                        <td className="px-4 py-2.5 font-medium text-gray-900">{r.row.full_name}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-xs">{r.row.phone || '—'}</td>
                        <td className="px-4 py-2.5">
                          {r.member_id
                            ? <span className="font-mono font-bold text-teal-700">{r.member_id}<CopyButton text={r.member_id} /></span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-2.5">
                          {r.password
                            ? <span className="font-mono text-gray-700">{r.password}<CopyButton text={r.password} /></span>
                            : r.status === 'error'
                              ? <span className="text-red-600 text-xs">{r.error}</span>
                              : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {r.status === 'success' && <CheckCircle2 size={16} className="text-green-500 mx-auto" />}
                          {r.status === 'error'   && <XCircle size={16} className="text-red-500 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Link href={`/${locale}/admin/members`}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors">
              View Member Roster
            </Link>
            <button onClick={() => { setRows([]); setResults([]); setDone(false); if (fileRef.current) fileRef.current.value = ''; }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
              Import Another Batch
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
