import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

function useCountUp(target: number, duration = 2000, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, active]);
  return count;
}

function StatItem({ value, suffix, label, color }: { value: number; suffix: string; label: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 2000, active);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const display = value >= 1000 ? (count >= 1000 ? `${Math.floor(count / 1000)}K` : count) : count;

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl sm:text-5xl font-extrabold" style={{ color }}>{display}{suffix}</p>
      <p className="text-gray-500 mt-2 text-sm">{label}</p>
    </div>
  );
}

export default function Stats() {
  const { t } = useTranslation();

  const stats = [
    { value: 50000, suffix: '+', label: t('stats.farmers'), color: '#0D592A' },
    { value: 120000, suffix: '+', label: t('stats.products'), color: '#1d4ed8' },
    { value: 35, suffix: '+', label: t('stats.countries'), color: '#c2410c' },
    { value: 2, suffix: 'M+', label: t('stats.transactions'), color: '#7c3aed' },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map(s => <StatItem key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}
