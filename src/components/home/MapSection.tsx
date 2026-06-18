// Replace GOOGLE_MAPS_EMBED_URL with your embed URL from:
// Google Maps → Share → Embed a map → copy the src URL
const GOOGLE_MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=22.686103,88.347538&z=16&ie=UTF8&iwloc=&output=embed';

export default function MapSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-saffron-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Find Us
          </p>
          <h2 className="text-3xl font-bold text-gray-900">Come Visit the Studio</h2>
          <p className="text-gray-500 mt-3">
            12/1, Debaipukur Road, P.O. Hindmotor, Dist. Hooghly, West Bengal — PIN 712 233
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm flex-wrap">
            <a href="tel:03326943100" className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium">
              📞 (033) 2694 3100
            </a>
            <a href="tel:+918017112877" className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium">
              📱 +91 80171 12877
            </a>
            <a href="tel:+919123991667" className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-medium">
              📱 +91 91239 91667
            </a>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-80 lg:h-96">
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="School Location"
          />
        </div>
      </div>
    </section>
  );
}
