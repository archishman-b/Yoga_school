'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import AdminMemberForm, { type MemberFormData } from './AdminMemberForm';

type Props = {
  mode:       'add' | 'edit';
  memberId?:  string;
  initial?:   Partial<MemberFormData>;
  onClose:    () => void;
  onSuccess?: () => void;
};

export default function AdminMemberDrawer({ mode, memberId, initial, onClose, onSuccess }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const title = mode === 'add' ? 'Add New Member' : 'Edit Member';
  const sub   = mode === 'add'
    ? 'Fill in the details below. A Member ID and temporary password will be generated automatically.'
    : 'Update any field and save. Member ID cannot be changed after creation.';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{sub}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors mt-0.5">
            <X size={22} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <AdminMemberForm
            mode={mode}
            memberId={memberId}
            initial={initial}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </aside>
    </>
  );
}
