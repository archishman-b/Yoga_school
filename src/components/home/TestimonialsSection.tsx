import { createClient } from '@/lib/supabase/server';
import { Quote, Star } from 'lucide-react';

// Fallback testimonials shown when DB has no approved+ordered ones yet
const FALLBACKS = [
  { body: 'Joining Nibedita Yoga Training Centre was the best decision I made for my health. My back pain of 10 years is almost completely gone.', full_name: 'Priya Sharma', photo_url: null, rating: 5 },
  { body: 'I came here skeptical — yoga seemed too gentle for me. Six months later, I have never been stronger or more flexible. The teaching is exceptional.', full_name: 'Rahul Verma', photo_url: null, rating: 5 },
  { body: 'At 65, I thought I was too old to start. The teacher made me feel completely welcome. My sleep and energy have transformed.', full_name: 'Meena Devi', photo_url: null, rating: 5 },
  { body: 'The trilingual teaching is wonderful. I could follow in Bengali from day one, which made everything so much clearer.', full_name: 'Arnab Roy', photo_url: null, rating: 4 },
  { body: 'My blood sugar levels have consistently improved since I started. My doctor is impressed — I am too.', full_name: 'Sunita Agarwal', photo_url: null, rating: 5 },
];

function Stars({ n }: { n: number | null }) {
  if (!n) return null;
  return (
    <div className="flex gap-0.5 mb-3">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} className={i <= n ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
      ))}
    </div>
  );
}

export default async function TestimonialsSection() {
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
    <section className="py-20 bg-gradient-to-br from-gray-50 to-saffron-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Our Students Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
              <Quote size={26} className="text-saffron-300 mb-3" />
              <Stars n={item.rating} />
              <p className="text-gray-700 leading-relaxed flex-1 italic">"{item.body}"</p>
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-50">
                {item.photo_url ? (
                  <img src={item.photo_url} className="w-10 h-10 rounded-full object-cover" alt="" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-saffron-50 flex items-center justify-center text-xl shrink-0">
                    🙏
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.full_name ?? 'Member'}</p>
                  <p className="text-gray-400 text-xs">Nibedita Yoga Member</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
