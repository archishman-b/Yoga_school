// Replace GOOGLE_MAPS_EMBED_URL with your embed URL from:
// Google Maps → Share → Embed a map → copy the src URL
const GOOGLE_MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=Your+School+Name+Your+City&t=&z=15&ie=UTF8&iwloc=&output=embed';

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
            We are conveniently located at [Your Address]. Parking available.
          </p>
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
