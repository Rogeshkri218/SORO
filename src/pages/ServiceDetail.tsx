import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { services } from '@/data/services';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === slug);

  if (!service) return <Navigate to="/services" replace />;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{service.title} — SORO Fabrications Private Limited</title>
        <meta name="description" content={service.description} />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-soro-ivory overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-soro relative z-10">
          <ScrollReveal>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-soro-ink hover:text-soro-blue text-sm mb-6 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ChevronLeft className="w-4 h-4" />
              All Services
            </Link>
            <div className="badge-blue mb-5 w-fit">Service</div>
            <h1 className="text-display text-soro-blue mb-6 max-w-3xl">
              {service.title}
            </h1>
            <p
              className="text-soro-ink text-lg max-w-2xl leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {service.shortDesc}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Details */}
      <section className="py-20 bg-soro-ivory">
        <div className="container-soro">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Description */}
            <ScrollReveal className="lg:col-span-2">
              <h2
                className="text-section-title text-soro-blue mb-6"
              >
                About This Service
              </h2>
              <p
                className="text-soro-ink leading-relaxed text-base mb-10"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {service.description}
              </p>

              <h3
                className="text-soro-blue font-bold text-lg mb-5"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Applications
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {service.applications.map((app) => (
                  <li
                    key={app}
                    className="flex items-start gap-3 glass-light p-3 rounded-lg text-sm text-soro-ink"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-soro-coral shrink-0 mt-1.5" />
                    {app}
                  </li>
                ))}
              </ul>

              <Link to="/quote" className="btn-primary w-fit">
                Enquire About This Service
                <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>

            {/* Capabilities */}
            <ScrollReveal delay={0.15}>
              <div className="glass p-7 rounded-2xl">
                <h3
                  className="text-soro-blue font-bold mb-5 text-sm uppercase tracking-wide"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Capabilities
                </h3>
                <ul className="space-y-3">
                  {service.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-start gap-3 text-sm text-soro-ink"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <CheckCircle className="w-4 h-4 text-soro-blue shrink-0 mt-0.5" />
                      {cap}
                    </li>
                  ))}
                </ul>

                <div className="divider-glow my-6" />

                <div className="space-y-3">
                  <Link to="/quote" className="btn-primary w-full justify-center text-sm">
                    Request a Quote
                  </Link>
                  <Link to="/contact" className="btn-secondary w-full justify-center text-sm">
                    Ask a Question
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-soro-ivory">
        <div className="container-soro">
          <ScrollReveal className="text-center mb-8">
            <h2
              className="text-soro-blue font-bold text-xl"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Other Services
            </h2>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-3">
            {services
              .filter((s) => s.slug !== slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="px-4 py-2 bg-soro-ivory border border-soro-border/60 hover:border-soro-blue/40 hover:text-soro-blue text-soro-ink rounded-full text-sm transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {s.title}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};

export default ServiceDetail;
