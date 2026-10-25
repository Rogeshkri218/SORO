import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { industries } from '@/data/industries';
import {
  HeartPulse,
  Factory,
  Sprout,
  Wifi,
  GraduationCap,
  FlaskConical,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'heart-pulse': <HeartPulse className="w-8 h-8" />,
  factory: <Factory className="w-8 h-8" />,
  sprout: <Sprout className="w-8 h-8" />,
  wifi: <Wifi className="w-8 h-8" />,
  'graduation-cap': <GraduationCap className="w-8 h-8" />,
  'flask-conical': <FlaskConical className="w-8 h-8" />,
};

const colours = ['#226192', '#EF8557', '#226192', '#EF8557', '#226192', '#EF8557'];

const Industries: React.FC = () => (
  <HelmetProvider>
    <Helmet>
      <title>Potential Applications — SORO Fabrications</title>
      <meta
        name="description"
        content="Illustrative application areas for electronic and mechanical product development at SORO Fabrications."
      />
    </Helmet>

    {/* Hero */}
    <section className="relative pt-36 pb-20 bg-soro-ivory overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="container-soro relative z-10">
        <ScrollReveal>
          <div className="badge-blue mb-5 w-fit">Industries</div>
          <h1 className="text-display text-soro-blue mb-6 max-w-3xl">
            Potential Engineering{' '}
            <span className="gradient-text">Applications</span>
          </h1>
          <p
            className="text-soro-ink text-lg max-w-2xl leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            These examples describe possible application areas, not confirmed customers,
            engagements, or sector-specific experience.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Industries Grid Overview */}
    <section className="py-10 bg-soro-ivory">
      <div className="container-soro">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map((ind, i) => (
            <a
              key={ind.id}
              href={`#${ind.id}`}
              className="glass-light p-5 rounded-xl text-center hover:-translate-y-1 transition-all duration-300 group block"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${colours[i]}15`, border: `1px solid ${colours[i]}30`, color: colours[i] }}
              >
                {iconMap[ind.icon]}
              </div>
              <span
                className="text-soro-ink text-xs group-hover:text-soro-blue transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {ind.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* Detailed Industry Sections */}
    {industries.map((industry, i) => (
      <section
        key={industry.id}
        id={industry.id}
        className={`py-24 ${i % 2 === 0 ? 'bg-soro-ivory' : 'bg-soro-white/40'}`}
      >
        <div className="container-soro">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <ScrollReveal className={i % 2 !== 0 ? 'lg:order-2' : ''}>
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `${colours[i]}15`,
                  border: `1px solid ${colours[i]}30`,
                  color: colours[i],
                }}
              >
                {iconMap[industry.icon]}
              </div>
              <div className="badge-blue mb-4 w-fit">Illustrative Application Area</div>
              <h2 className="text-section-title text-soro-blue mb-5">{industry.title}</h2>
              <p
                className="text-soro-ink leading-relaxed mb-8"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {industry.description}
              </p>
              <Link to="/quote" className="btn-primary w-fit">
                Discuss Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.15} className={i % 2 !== 0 ? 'lg:order-1' : ''}>
              <div className="glass p-7 rounded-2xl">
                <h3
                  className="text-soro-blue font-bold mb-5 text-sm uppercase tracking-wide"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Engineering Applications
                </h3>
                <ul className="space-y-3">
                  {industry.applications.map((app) => (
                    <li
                      key={app}
                      className="flex items-start gap-3 text-sm text-soro-ink"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <CheckCircle
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: colours[i] }}
                      />
                      {app}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    ))}

    {/* CTA */}
    <section className="py-16 bg-soro-ivory">
      <div className="container-soro text-center">
        <ScrollReveal>
          <h2
            className="text-soro-blue font-bold text-2xl mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
                  Discuss an Engineering Need
          </h2>
          <p
            className="text-soro-ink mb-8 max-w-xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Share your requirements and SORO can confirm whether the scope is a fit.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/quote" className="btn-primary">
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </HelmetProvider>
);

export default Industries;
