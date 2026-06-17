import { requireAdmin } from '@/lib/supabase/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

type Props = { children: React.ReactNode; params: { locale: string } };

export default async function AdminLayout({ children, params: { locale } }: Props) {
  await requireAdmin(locale);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar locale={locale} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
