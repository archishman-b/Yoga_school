import { getTranslations } from 'next-intl/server';
import { Heart, Wind, Brain, Activity, Award, Users, BookOpen } from 'lucide-react';

export default async function AboutSection() {
  const t = await getTranslations('about');

  const BODY_SYSTEMS = [
    { icon: Heart,    label: t('sysCirculatoryLabel'), desc: t('sysCirculatoryDesc') },
    { icon: Wind,     label: t('sysRespiratoryLabel'), desc: t('sysRespiratoryDesc') },
    { icon: Activity, label: t('sysDigestiveLabel'),   desc: t('sysDigestiveDesc') },
    { icon: Brain,    label: t('sysExcretoryLabel'),   desc: t('sysExcretoryDesc') },
  ];

  const HEALTH_DIMS = [
    { label: t('healthDimMentalLabel'),   desc: t('healthDimMentalDesc') },
    { label: t('healthDimPhysicalLabel'), desc: t('healthDimPhysicalDesc') },
    { label: t('healthDimSocialLabel'),   desc: t('healthDimSocialDesc') },
  ];

  const ACCESSIBILITY = [
    { icon: '🛏️', title: t('accessSpaceTitle'),    desc: t('accessSpaceDesc') },
    { icon: '👕', title: t('accessClothingTitle'), desc: t('accessClothingDesc') },
    { icon: '🌱', title: t('accessLevelsTitle'),   desc: t('accessLevelsDesc') },
  ];

  return (
    <section id="about" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-[clamp(18px,5vw,56px)] space-y-24">

        {/* ── Intro: School story ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center reveal">

          {/* Left: text */}
          <div>
            <span className="eyebrow">{t('eyebrow')}</span>
            <h2 className="font-rozha font-normal text-ink mb-6 leading-[1.1]"
                style={{ fontSize: 'clamp(30px, 4.5vw, 52px)' }}>
              {t('headingLine1')}<br />
              <span className="text-gradient-saffron">{t('headingHighlight')}</span><br />
              {t('headingLine3')}<br />
              {t('headingLine4')}
            </h2>
            <p className="text-ink/70 leading-relaxed text-lg mb-4">
              {t('schoolDesc1')}
            </p>
            <p className="text-ink/60 leading-relaxed">
              {t('schoolDesc2')}
            </p>
          </div>

          {/* Right: three health dimensions */}
          <div className="space-y-4">
            {HEALTH_DIMS.map(d => (
              <div key={d.label} className="card card-hover flex gap-5 p-5">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-saffron-500/10 flex items-center justify-center mt-0.5">
                  <span className="w-3 h-3 rounded-full bg-saffron-500 block" />
                </div>
                <div>
                  <p className="font-semibold text-ink text-base">{d.label}</p>
                  <p className="text-sm text-ink/60 mt-0.5 leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Founder quote pull-quote ──────────────────────────────────────── */}
        <div
          className="relative rounded-card2 p-[clamp(36px,5vw,64px)] text-white overflow-hidden reveal"
          style={{ background: 'linear-gradient(135deg, #0D6B6E 0%, #074042 100%)' }}
        >
          <span
            className="absolute top-4 left-6 font-rozha leading-none select-none pointer-events-none opacity-20"
            style={{ fontSize: 'clamp(80px, 14vw, 160px)', color: '#F4A04A' }}
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <p className="text-xl sm:text-2xl font-light leading-relaxed italic mb-6">
              {t('founderQuote')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-saffron-400/50 block" />
              <p className="text-saffron-400 font-semibold text-sm tracking-wide">{t('founderAttrib')}</p>
              <span className="w-8 h-px bg-saffron-400/50 block" />
            </div>
          </div>
        </div>

        {/* ── Four body systems ─────────────────────────────────────────────── */}
        <div className="reveal">
          <div className="text-center mb-12">
            <span className="eyebrow">{t('fourSystemsEyebrow')}</span>
            <h2 className="font-rozha font-normal text-ink"
                style={{ fontSize: 'clamp(26px, 3.5vw, 42px)' }}>
              {t('fourSystemsHeading')}
            </h2>
            <p className="text-ink/60 mt-4 max-w-2xl mx-auto leading-relaxed">
              {t('fourSystemsDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BODY_SYSTEMS.map(s => (
              <div key={s.label} className="card card-hover p-6 text-center">
                <div className="w-12 h-12 bg-teal-600/10 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <s.icon size={22} />
                </div>
                <p className="font-semibold text-ink mb-2">{s.label}</p>
                <p className="text-sm text-ink/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Teacher / founder bio ─────────────────────────────────────────── */}
        <div
          className="rounded-card2 p-[clamp(28px,4vw,52px)] reveal"
          style={{ background: 'linear-gradient(160deg, #E9F3F3, #DDEDED)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Photo + mini stats */}
            <div className="flex flex-col items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/rekhanath.JPG"
                alt="Rekha Nath — Founder &amp; Lead Instructor, Nibedita Yoga Training Centre"
                className="w-48 h-48 rounded-full object-cover object-top shadow-teal"
                style={{ border: '3px solid rgba(13,107,110,0.18)' }}
              />
              <div className="flex gap-3 text-center">
                {[
                  { icon: <Award size={16}/>, val: '26+', lbl: t('statYears') },
                  { icon: <Users size={16}/>, val: '10,000+', lbl: t('statStudents') },
                  { icon: <BookOpen size={16}/>, val: '8', lbl: t('statProgrammes') },
                ].map(s => (
                  <div key={s.lbl} className="bg-cream-card rounded-[14px] px-3 py-2.5 shadow-card border border-teal-600/10 text-center">
                    <div className="text-teal-600 flex justify-center mb-1">{s.icon}</div>
                    <p className="font-rozha text-ink text-lg">{s.val}</p>
                    <p className="text-[11px] text-ink/50 leading-tight">{s.lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio text */}
            <div className="lg:col-span-2 space-y-4">
              <span className="eyebrow">{t('teacherEyebrow')}</span>
              <h3 className="font-rozha font-normal text-ink" style={{ fontSize: 'clamp(22px, 3vw, 34px)' }}>
                {t('teacherName')}
              </h3>
              <p className="text-ink/70 leading-relaxed">{t('teacherBio1')}</p>
              <p className="text-ink/70 leading-relaxed">{t('teacherBio2')}</p>
              <p className="text-ink/70 leading-relaxed">{t('teacherBio3')}</p>
              <div className="bg-saffron-500/10 border border-saffron-500/20 rounded-input px-4 py-3 text-xs text-saffron-600 mt-2">
                <span className="font-semibold">📋 Note for admin:</span> Please provide Rekha
                Nath&apos;s formal qualifications, certifications, and training lineage to complete
                this section.
              </div>
            </div>
          </div>
        </div>

        {/* ── Accessibility callout cards ───────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 reveal">
          {ACCESSIBILITY.map(c => (
            <div key={c.title} className="card card-hover text-center px-6 py-8">
              <div className="text-4xl mb-4">{c.icon}</div>
              <h4 className="font-semibold text-ink mb-2">{c.title}</h4>
              <p className="text-sm text-ink/60 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
