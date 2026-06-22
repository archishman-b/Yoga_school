import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';

const FALLBACKS = [
  { body: 'Joining Nibedita Yoga Training Centre was the best decision I made for my health. My back pain of 10 years is almost completely gone.', full_name: 'Priya Sharma', photo_url: null, rating: 5 },
  { body: 'I came here skeptical — yoga seemed too gentle for me. Six months later, I have never been stronger or more flexible. The teaching is exceptional.', full_name: 'Rahul Verma', photo_url: null, rating: 5 },
  { body: 'At 65, I thought I was too old to start. The teacher made me feel completely welcome. My sleep and energy have transformed.', full_name: 'Meena Devi', photo_url: null, rating: 5 },
  { body: 'The trilingual teaching is wonderful. I could follow in Bengali from day one, which made everything so much clearer.', full_name: 'Arnab Roy', photo_url: null, rating: 4 },
  { body: 'My blood sugar levels have consistently improved since I started. My doctor is impressed — I am too.', full_name: 'Sunita Agarwal', photo_url: null, rating: 5 },
  { body: 'The atmosphere here is unlike any gym or fitness studio. It is calm, focused, and deeply supportive. I recommend it to everyone.', full_name: 'Suresh Das', photo_url: null, rating: 5 },
];

function Stars({ n }: { n: number | null }) {
  if (!n) return null;
  return (
    <div className="flex gap-0.5 mb-3">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} className={i <= n ? 'text-saffron-400 fill-saffron-400' : 'text-ink/10 fill-ink/10'} />
      ))}
    </div>
  );
}

export default async function TestimonialsSection() {
  const t = await getTranslations('testimonials');
  const supabase = createClient();
  const { data: rows } = await supabase
    .from('testimonials')
    .select('body, rating, display_order, member:profiles(full_name, photo_url)')
    .eq('status', 'approved')
    .not('display_order', 'is', null)
    .order('display_order', { ascending: true })
    .limit(6);

  type Item = { body: string; full_name: string | null; photo_url: string | null; rating: number | null };
  const items: Item[] = rows && rows.length > 0
    ? rows.map((r: any) => ({
        body: r.body,
        full_name: r.member?.full_name ?? null,
        photo_url: r.member?.photo_url ?? null,
        rating: r.rating,
      }))
    : FALLBACKS;

  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-[clamp(18px,5vw,56px)]">

        {/* ── Section header ────────────────────────────────────────────────── */}
        <div className="text-center mb-14 reveal">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2
            className="font-rozha font-normal text-ink"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {t('heading')}
          </h2>
        </div>

        {/* ── Cards grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="card card-hover flex flex-col p-7"
            >
              <span
                className="font-rozha text-saffron-400 leading-none mb-2 block"
                style={{ fontSize: '52px', lineHeight: 1 }}
                aria-hidden="true"
              >
                &ldquo;
              </span>

              <Stars n={item.rating} />

              <p className="text-ink/70 leading-relaxed flex-1 text-[15px]">
                {item.body}
              </p>

              <div className="flex items-center gap-3 pt-5 mt-5 border-t border-teal-600/10">
                {item.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.photo_url} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-lg"
                    style={{ background: 'linear-gradient(135deg, #0D6B6E, #E8740C)' }}
                  >
                    🙏
                  </div>
                )}
                <div>
                  <p className="font-semibold text-ink text-sm">{item.full_name ?? 'Member'}</p>
                  <p className="text-teal-600 text-xs">{t('memberLabel')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
