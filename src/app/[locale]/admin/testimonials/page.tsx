import { requireAdmin } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import TestimonialModerator from '@/components/admin/TestimonialModerator';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Testimonials' };
type Props = { params: { locale: string } };

export default async function AdminTestimonialsPage({ params: { locale } }: Props) {
  await requireAdmin(locale);
  const supabase = createClient();
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*, member:profiles(full_name, photo_url)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <p className="text-gray-500 text-sm mt-1">Approve submissions and curate what appears on the landing page.</p>
      </div>
      <TestimonialModerator testimonials={testimonials ?? []} />
    </div>
  );
}
