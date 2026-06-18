import { blogPosts } from '@/lib/data/blog-posts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: { locale: string; slug: string };
};

export function generateStaticParams() {
  return blogPosts.flatMap((post) =>
    ['en', 'hi', 'bn'].map((locale) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  const locale = params.locale as 'en' | 'hi' | 'bn';
  return {
    title: post[`title_${locale}`] || post.title_en,
    description: post[`excerpt_${locale}`] || post.excerpt_en,
  };
}

function renderMarkdown(content: string) {
  // Simple markdown → HTML for headings and paragraphs
  return content
    .split('\n\n')
    .map((block) => {
      if (block.startsWith('## ')) {
        return `<h2 class="text-2xl font-bold text-ink mt-10 mb-4">${block.slice(3)}</h2>`;
      }
      if (block.startsWith('### ')) {
        return `<h3 class="text-xl font-semibold text-ink mt-8 mb-3">${block.slice(4)}</h3>`;
      }
      // Bold
      const html = block
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      return `<p class="text-ink/80 leading-relaxed mb-5">${html}</p>`;
    })
    .join('\n');
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const locale = params.locale as 'en' | 'hi' | 'bn';
  const title = post[`title_${locale}`] || post.title_en;
  const content = post[`content_${locale}`] || post.content_en;

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-900 to-gray-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${locale}/yoga`}
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Articles
          </Link>
          <div className="flex gap-2 flex-wrap mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-teal-800/60 text-teal-200 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{title}</h1>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          className="prose-custom"
        />

        {/* Back link */}
        <div className="mt-14 pt-8 border-t border-teal-600/10">
          <Link
            href={`/${locale}/yoga`}
            className="inline-flex items-center gap-2 text-teal-700 font-medium hover:text-teal-600 transition-colors"
          >
            <ArrowLeft size={18} /> Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
}
