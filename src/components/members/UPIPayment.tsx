'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, CheckCircle2, AlertCircle, Copy } from 'lucide-react';

// ── Replace these with your actual UPI details ──────────────────
const UPI_ID = 'yogaschool@upi';           // e.g. name@okaxis
const UPI_QR_URL = '/upi-qr.png';          // put your QR image in /public/upi-qr.png
const SCHOOL_NAME = 'Nibedita Yoga Training Centre';
// ─────────────────────────────────────────────────────────────────

type FeeRecord = { id: string; month: string; amount: number; status: string };

type Props = { pendingFees: FeeRecord[]; memberId: string };

export default function UPIPayment({ pendingFees, memberId }: Props) {
  const [selectedFeeId, setSelectedFeeId] = useState(pendingFees[0]?.id ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedFee = pendingFees.find((f) => f.id === selectedFeeId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!file || !selectedFeeId) return;
    setStatus('uploading');
    const supabase = createClient();

    const ext = file.name.split('.').pop();
    const path = `${memberId}/${selectedFeeId}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('payment-screenshots')
      .upload(path, file, { upsert: true });

    if (uploadErr) { setStatus('error'); return; }

    const { data: urlData } = supabase.storage.from('payment-screenshots').getPublicUrl(path);

    const { error: updateErr } = await supabase
      .from('fee_records')
      .update({ status: 'screenshot_uploaded', screenshot_url: urlData.publicUrl })
      .eq('id', selectedFeeId);

    if (updateErr) { setStatus('error'); return; }
    setStatus('done');
  };

  if (status === 'done') {
    return (
      <div className="card p-6 border-green-100 bg-green-50/40 flex items-start gap-4">
        <CheckCircle2 size={22} className="text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-ink">Screenshot submitted!</p>
          <p className="text-sm text-ink/55 mt-0.5">
            Your teacher will verify and confirm your payment. Status will update to "Paid" soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-5">
      <h2 className="font-semibold text-ink text-base">Pay via UPI</h2>

      {/* Fee selector */}
      {pendingFees.length > 1 && (
        <div>
          <label className="label">Select the month you are paying for</label>
          <select
            value={selectedFeeId}
            onChange={(e) => setSelectedFeeId(e.target.value)}
            className="input"
          >
            {pendingFees.map((f) => {
              const d = new Date(f.month + '-01');
              const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
              return (
                <option key={f.id} value={f.id}>
                  {label} — ₹{f.amount.toLocaleString('en-IN')} ({f.status})
                </option>
              );
            })}
          </select>
        </div>
      )}

      {selectedFee && (
        <div className="flex gap-6 flex-wrap">
          {/* QR code */}
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={UPI_QR_URL}
              alt="UPI QR Code"
              className="w-36 h-36 object-contain border border-teal-600/10 rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <p className="text-xs text-ink/40">Scan with any UPI app</p>
          </div>

          {/* Payment details */}
          <div className="flex-1 space-y-3 min-w-[180px]">
            <div className="bg-saffron-50 border border-saffron-100 rounded-xl px-4 py-3 space-y-1">
              <p className="text-xs text-ink/55">Pay to</p>
              <p className="font-semibold text-ink text-sm">{SCHOOL_NAME}</p>
              <div className="flex items-center gap-2">
                <code className="text-teal-700 font-mono text-sm">{UPI_ID}</code>
                <button
                  onClick={handleCopy}
                  className="text-ink/40 hover:text-teal-600 transition-colors"
                  title="Copy UPI ID"
                >
                  {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-cream-dark/50 rounded-xl px-4 py-3">
              <span className="text-sm text-ink/70">Amount due</span>
              <span className="text-lg font-bold text-ink">
                ₹{selectedFee.amount.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-xs text-ink/40 leading-relaxed">
              After paying, upload your payment screenshot below. Your status will be updated once verified by your teacher.
            </p>
          </div>
        </div>
      )}

      {/* Screenshot upload */}
      <div>
        <label className="label">Upload Payment Screenshot</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-teal-600/15 hover:border-teal-300 rounded-xl p-5 text-center cursor-pointer transition-colors"
        >
          {preview ? (
            <img src={preview} alt="Screenshot preview" className="mx-auto max-h-40 rounded-lg object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink/40">
              <Upload size={24} />
              <p className="text-sm">Click to upload screenshot</p>
              <p className="text-xs">JPG, PNG, or PDF</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          Upload failed. Check your connection and try again.
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || status === 'uploading'}
        className="btn-primary disabled:opacity-50"
      >
        {status === 'uploading' ? 'Submitting...' : 'Submit Screenshot'}
      </button>
    </div>
  );
}
