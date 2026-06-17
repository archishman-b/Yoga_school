import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { blogPosts, allTags } from '@/lib/data/blog-posts';
import BlogCard from '@/components/blog/BlogCard';
import TagFilter from '@/components/blog/TagFilter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The History & Science of Yoga',
  description:
    'Deepen your understanding of yoga — from its 5,000-year history to modern neuroscience. Articles on philosophy, practice, breathwork, and more.',
};

type Props = { searchParams: { tag?: string } };

export default function YogaPage({ searchParams }: Props) {
  const t = useTranslations('yoga');
  const locale = useLocale();
  const activeTag = searchParams.tag;

  const filtered = activeTag
    ? blogPosts.filter((p) => p.tags.includes(activeTag))
    : blogPosts;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-900 to-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Knowledge Base
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('heading')}</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('subheading')}</p>
        </div>
      </div>

      {/* Tag filter */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <TagFilter tags={allTags} activeTag={activeTag} allLabel={t('allTags')} locale={locale} />
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} readMore={t('readMore')} />
          ))}
        </div>
      </div>
    </div>
  );
}
