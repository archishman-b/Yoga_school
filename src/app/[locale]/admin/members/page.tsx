import { createClient } from '@/lib/supabase/server';
import AdminMembersClient from '@/components/admin/AdminMembersClient';

type Props = { params: { locale: string } };

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

  return (
    <AdminMembersClient
      locale={locale}
      members={members ?? []}
      enrollments={enrollments ?? []}
      fees={feeRecords ?? []}
      currentMonth={currentMonth}
    />
  );
}
