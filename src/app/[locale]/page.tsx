import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import MapSection from '@/components/home/MapSection';
import EnquiryForm from '@/components/home/EnquiryForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ananda Yoga Kendra — Authentic Yoga in Your City',
  description:
    'Join Ananda Yoga Kendra for expert Hatha, Vinyasa, and Pranayama classes. All levels welcome. Book a free trial class today.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <TestimonialsSection />
      <MapSection />
      <EnquiryForm />
    </>
  );
}
