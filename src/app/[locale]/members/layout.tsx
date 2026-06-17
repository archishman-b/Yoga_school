import MemberSidebar from '@/components/members/MemberSidebar';

type Props = { children: React.ReactNode; params: { locale: string } };

export default function MembersLayout({ children, params: { locale } }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <MemberSidebar locale={locale} />
          </aside>
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
