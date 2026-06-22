import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/ping
 * Cron health-check + monthly fee auto-generation.
 * Call from Vercel Cron (vercel.json) or any external scheduler.
 *
 * Secured via CRON_SECRET header for production.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const supabase = createClient();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Auto-generate fee records for the current month for all active enrollments
  // that don't already have a record for this month.
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('member_id, batch_id, batches(fee_monthly)')
    .eq('status', 'active');

  const { data: existing } = await supabase
    .from('fee_records')
    .select('member_id')
    .eq('month', month);

  const existingIds = new Set((existing ?? []).map((r: any) => r.member_id));

  const toInsert = (enrollments ?? [])
    .filter((e: any) => !existingIds.has(e.member_id))
    .map((e: any) => ({
      member_id: e.member_id,
      amount: (e.batches as any)?.fee_monthly ?? null,
      month,
      due_date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-10`,
      status: 'pending',
    }));

  if (toInsert.length > 0) {
    await supabase.from('fee_records').insert(toInsert);
  }

  // Mark past-due records as overdue
  const today = now.toISOString().split('T')[0];
  await supabase
    .from('fee_records')
    .update({ status: 'overdue', updated_at: new Date().toISOString() })
    .eq('status', 'pending')
    .lt('due_date', today);

  return NextResponse.json({
    ok: true,
    timestamp: now.toISOString(),
    month,
    fee_records_created: toInsert.length,
  });
}
