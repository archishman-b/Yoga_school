import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import AboutSection from '@/components/home/AboutSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import MapSection from '@/components/home/MapSection';
import EnquiryForm from '@/components/home/EnquiryForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nibedita Yoga Training Centre — Authentic Yoga in Hindmotor, Hooghly',
  description:
    'Join Nibedita Yoga Training Centre for expert Hatha, Vinyasa, and Pranayama classes in Hindmotor, Hooghly. All levels welcome. Book a free trial class today.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <TestimonialsSection />
      <MapSection />
      <EnquiryForm />
    </>
  );
}
