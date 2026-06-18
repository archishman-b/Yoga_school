import Link from 'next/link';
import { useLocale } from 'next-intl';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Nibedita Yoga</p>
                <p className="text-saffron-400 text-xs">Training Centre</p>
              </div>
            </div>
            <p className="font-bengali text-teal-400 text-sm mb-2">নিবেদিতা যোগ প্রশিক্ষণ কেন্দ্র</p>
            <p className="text-xs text-gray-500 italic leading-relaxed mt-3">
              "Yoga for all group, all profession and all religions."
            </p>
            <p className="text-xs text-gray-600 mt-1">— Rekha Nath, Founder</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: `/${locale}`, label: 'Home' },
                { href: `/${locale}/courses`, label: 'Courses & Programmes' },
                { href: `/${locale}/yoga`, label: 'Yoga Articles' },
                { href: `/${locale}/events`, label: 'Events' },
                { href: `/${locale}/members`, label: 'Member Portal' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-saffron-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-saffron-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  12/1, Debaipukur Road<br />
                  P.O. Hindmotor, Dist. Hooghly<br />
                  West Bengal — PIN 712 233
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-saffron-400 shrink-0" />
                <div className="space-y-0.5">
                  <a href="tel:03326943100" className="block hover:text-white transition-colors">(033) 2694 3100</a>
                  <a href="tel:+918017112877" className="block hover:text-white transition-colors">+91 80171 12877</a>
                  <a href="tel:+919123991667" className="block hover:text-white transition-colors">+91 91239 91667</a>
                </div>
              </li>
              {/* Email — placeholder until confirmed */}
              <li className="flex items-center gap-2 opacity-50">
                <Mail size={15} className="text-saffron-400 shrink-0" />
                <span className="text-xs italic">Email — coming soon</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Office Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Clock size={15} className="text-saffron-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-200 font-medium">Monday – Friday</p>
                  <p className="text-gray-400 text-xs">6:00 AM – 9:00 PM</p>
                </div>
              </li>
              <li className="ml-5 text-xs text-gray-500">
                Closed Saturdays, Sundays &amp; National Holidays
              </li>
              <li className="ml-5 text-xs text-teal-400 mt-2">
                New student orientation on Saturdays
              </li>
            </ul>

            <div className="mt-5">
              <a
                href="https://wa.me/918017112877?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20yoga%20classes%20at%20Nibedita%20Yoga%20Training%20Centre."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          © {year} Nibedita Yoga Training Centre. All rights reserved. · nibedita.yoga
        </div>
      </div>
    </footer>
  );
}
