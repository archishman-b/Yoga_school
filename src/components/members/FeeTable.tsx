'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type FeeRecord = {
  id: string;
  month: string;
  amount: number;
  status: 'pending' | 'screenshot_uploaded' | 'confirmed' | 'overdue';
  due_date: string;
  paid_date?: string | null;
  screenshot_url?: string | null;
};

const STATUS_STYLES: Record<FeeRecord['status'], string> = {
  pending:             'bg-yellow-50 text-yellow-700 border border-yellow-200',
  screenshot_uploaded: 'bg-blue-50 text-blue-700 border border-blue-200',
  confirmed:           'bg-green-50 text-green-700 border border-green-200',
  overdue:             'bg-red-50 text-red-700 border border-red-200',
};

function formatMonth(m: string) {
  const d = new Date(m + '-01');
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export default function FeeTable({ fees }: { fees: FeeRecord[] }) {
  const t = useTranslations('fees');

  const STATUS_LABEL: Record<FeeRecord['status'], string> = {
    pending:             t('statusPending'),
    screenshot_uploaded: t('statusVerifying'),
    confirmed:           t('statusPaid'),
    overdue:             t('statusOverdue'),
  };

  if (fees.length === 0) {
    return (
      <div className="py-12 text-center text-ink/40 text-sm">
        {t('noRecords')}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-cream-dark/50 border-b border-teal-600/10 text-xs text-ink/55 uppercase tracking-wide">
            <th className="text-left px-5 py-3 font-medium">{t('colMonth')}</th>
            <th className="text-right px-5 py-3 font-medium">{t('colAmount')}</th>
            <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">{t('colDueDate')}</th>
            <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">{t('colPaidOn')}</th>
            <th className="text-left px-5 py-3 font-medium">{t('colStatus')}</th>
            <th className="text-left px-5 py-3 font-medium hidden md:table-cell">{t('colReceipt')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {fees.map((fee) => (
            <tr key={fee.id} className="hover:bg-cream-dark/50/50 transition-colors">
              <td className="px-5 py-3.5 font-medium text-ink">{formatMonth(fee.month)}</td>
              <td className="px-5 py-3.5 text-right text-ink">₹{fee.amount.toLocaleString('en-IN')}</td>
              <td className="px-5 py-3.5 text-ink/55 hidden sm:table-cell">
                {new Date(fee.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </td>
              <td className="px-5 py-3.5 text-ink/55 hidden sm:table-cell">
                {fee.paid_date
                  ? new Date(fee.paid_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
                  : '—'}
              </td>
              <td className="px-5 py-3.5">
                <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', STATUS_STYLES[fee.status])}>
                  {STATUS_LABEL[fee.status]}
                </span>
              </td>
              <td className="px-5 py-3.5 hidden md:table-cell">
                {fee.screenshot_url ? (
                  <a
                    href={fee.screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 text-xs underline underline-offset-2"
                  >
                    {t('viewReceipt')}
                  </a>
                ) : (
                  <span className="text-ink/30 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
