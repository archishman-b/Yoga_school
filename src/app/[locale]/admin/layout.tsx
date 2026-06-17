import { requireAdmin } from '@/lib/supabase/auth';
import AdminNav from '@/components/admin/AdminNav';

type Props = { children: React.ReactNode; params: { locale: string } };

export default async function AdminLayout({ children, params: { locale } }: Props) {
  await requireAdmin(locale);
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav locale={locale} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
