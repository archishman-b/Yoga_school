import Link from 'next/link';
import type { BlogPost } from '@/lib/data/blog-posts';
import { ArrowRight } from 'lucide-react';

type Locale = 'en' | 'hi' | 'bn';

type Props = {
  post: BlogPost;
  locale: string;
  readMore: string;
};

export default function BlogCard({ post, locale, readMore }: Props) {
  const l = locale as Locale;
  const title = post[`title_${l}`] || post.title_en;
  const excerpt = post[`excerpt_${l}`] || post.excerpt_en;

  return (
    <Link
      href={`/${locale}/yoga/${post.slug}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-teal-200 transition-all"
    >
      {/* Header color band */}
      <div className="h-2 bg-gradient-to-r from-teal-500 to-saffron-400" />

      <div className="p-6 flex-1 flex flex-col">
        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-teal-700 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-1">{excerpt}</p>

        <div className="mt-5 flex items-center gap-1 text-teal-600 text-sm font-medium">
          {readMore}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
