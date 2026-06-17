import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/ping
 * Keeps the Supabase free-tier project alive by issuing a lightweight DB read.
 * Call via Vercel Cron: schedule "0 4 * * *" in vercel.json.
 */
export async function GET() {
  try {
    const supabase = createClient();
    // Minimal query — just wake the DB
    const { error } = await supabase.from('batches').select('id').limit(1);
    if (error) throw error;
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
