import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Joining Nibedita Yoga Training Centre was the best decision I made for my health. My back pain of 10 years is almost completely gone.',
    name: 'Priya Sharma',
    role: 'School Teacher, Delhi',
    avatar: '👩',
  },
  {
    quote:
      'I came here skeptical — yoga seemed too gentle for me. Six months later, I have never been stronger or more flexible. The teaching is exceptional.',
    name: 'Rahul Verma',
    role: 'Software Engineer, Bengaluru',
    avatar: '👨',
  },
  {
    quote:
      'At 65, I thought I was too old to start. The teacher made me feel completely welcome and adapted everything perfectly. My sleep and energy have transformed.',
    name: 'Meena Devi',
    role: 'Retired, Kolkata',
    avatar: '👵',
  },
  {
    quote:
      'The trilingual teaching is wonderful. I could follow in Bengali from day one, which made everything so much clearer.',
    name: 'Arnab Roy',
    role: 'Business Owner, Kolkata',
    avatar: '🧑',
  },
  {
    quote:
      "My blood sugar levels have consistently improved since I started the diabetes-specific program. My doctor is impressed — I am too.",
    name: 'Sunita Agarwal',
    role: 'Home-maker, Varanasi',
    avatar: '👩‍🦱',
  },
];

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-saffron-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('heading')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Quote size={28} className="text-saffron-300 mb-4" />
              <p className="text-gray-700 leading-relaxed mb-6 italic">"{item.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full bg-saffron-50 flex items-center justify-center text-xl">
                  {item.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
