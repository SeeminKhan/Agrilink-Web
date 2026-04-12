import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import RolesSection from '../components/RolesSection';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Stats />
      <Features />
      <RolesSection />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </div>
  );
}
