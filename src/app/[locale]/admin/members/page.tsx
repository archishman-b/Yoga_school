import { createClient } from '@/lib/supabase/server';
import ApproveToggle from '@/components/admin/ApproveToggle';

type Props = { params: { locale: string } };

export default async function AdminMembersPage({ params: { locale } }: Props) {
  const supabase = createClient();
  const { data: members } = await supabase
    .from('profiles')
    .select('*')
    .order('joined_date', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-500 text-sm mt-1">{members?.length ?? 0} total profiles.</p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Email</th>
              <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Phone</th>
              <th className="text-left px-5 py-3 font-medium">Role</th>
              <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Joined</th>
              <th className="text-center px-5 py-3 font-medium">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(members ?? []).map((m: any) => (
              <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{m.full_name ?? '—'}</td>
                <td className="px-5 py-3 text-gray-500 hidden md:table-cell text-xs">{m.email}</td>
                <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{m.phone ?? '—'}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    m.role === 'admin'
                      ? 'bg-saffron-100 text-saffron-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {m.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-xs hidden lg:table-cell">{m.joined_date ?? '—'}</td>
                <td className="px-5 py-3 text-center">
                  <ApproveToggle memberId={m.id} currentStatus={m.status ?? 'active'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!members || members.length === 0) && (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No members yet.</p>
        )}
      </div>
    </div>
  );
}
