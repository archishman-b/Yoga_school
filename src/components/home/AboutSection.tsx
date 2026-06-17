import { useTranslations } from 'next-intl';
import { Award, Users, BookOpen } from 'lucide-react';

export default function AboutSection() {
  const t = useTranslations('about');

  const highlights = [
    { icon: <Award size={24} />, value: '15+', label: t('yearsExp') },
    { icon: <Users size={24} />, value: '500+', label: t('studentsCount') },
    { icon: <BookOpen size={24} />, value: '5+', label: t('certifications') },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* School About */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
          <div>
            <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {t('heading')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('schoolDesc')}
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="bg-gradient-to-br from-saffron-50 to-orange-50 rounded-2xl p-6 text-center border border-saffron-100"
              >
                <div className="w-12 h-12 bg-saffron-100 text-saffron-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  {h.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900">{h.value}</p>
                <p className="text-sm text-gray-500 mt-1">{h.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher About */}
        <div className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Teacher photo placeholder */}
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center shadow-xl text-6xl">
                🧘‍♀️
              </div>
            </div>
            <div className="lg:col-span-2">
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-2">
                {t('teacherHeading')}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('teacherName')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('teacherBio')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
