import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ServiceCard from '@/components/shared/ServiceCard';
import { services } from '@/data/services';

const Services: React.FC = () => (
  <HelmetProvider>
    <Helmet>
      <title>Engineering Services — SORO Fabrications Private Limited</title>
      <meta
        name="description"
        content="Discuss PCB design, prototype assembly, CAD, 3D printing, design review, and manufacturing support with SORO Fabrications."
      />
    </Helmet>

    {/* Hero */}
    <section className="relative pt-36 pb-20 bg-soro-ivory overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="container-soro relative z-10">
        <ScrollReveal>
          <div className="badge-blue mb-5 w-fit">Capabilities to Discuss</div>
          <h1 className="text-display text-soro-blue mb-6 max-w-3xl">
            Potential engineering scopes,{' '}
            <span className="gradient-text">confirmed project by project</span>
          </h1>
          <p
            className="text-soro-ink text-lg max-w-2xl leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            These are areas to discuss, not a statement of equipment, capacity, or guaranteed
            availability. Deliverables are agreed after reviewing each enquiry.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Service Cards Overview */}
    <section className="py-20 bg-soro-ivory">
      <div className="container-soro">
        <div className="grid-services">
          {services.map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 0.07}>
              <ServiceCard service={service} variant="full" />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Detailed Service Sections */}
    {services.map((service, i) => (
      <section
        key={service.id}
        id={service.slug}
        className={`py-20 ${i % 2 === 0 ? 'bg-soro-ivory' : 'bg-soro-white/40'}`}
      >
        <div className="container-soro">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <ScrollReveal>
              <div className="badge-blue mb-5 w-fit">{service.title}</div>
              <h2 className="text-section-title text-soro-blue mb-5">
                {service.title}
              </h2>
              <p
                className="text-soro-ink leading-relaxed mb-8"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {service.description}
              </p>
              <Link
                to={`/services/${service.slug}`}
                className="btn-primary w-fit"
              >
                Enquire About This Service
                <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ScrollReveal delay={0.15}>
                <div className="glass p-6 rounded-2xl h-full">
                  <h3
                    className="text-soro-blue font-bold mb-4 text-sm uppercase tracking-wide"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Capabilities
                  </h3>
                  <ul className="space-y-2">
                    {service.capabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-start gap-2 text-sm text-soro-ink"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <CheckCircle className="w-4 h-4 text-soro-blue shrink-0 mt-0.5" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.25}>
                <div className="glass p-6 rounded-2xl h-full">
                  <h3
                    className="text-soro-blue font-bold mb-4 text-sm uppercase tracking-wide"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Applications
                  </h3>
                  <ul className="space-y-2">
                    {service.applications.map((app) => (
                      <li
                        key={app}
                        className="flex items-start gap-2 text-sm text-soro-ink"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-soro-coral shrink-0 mt-1.5" />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
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
            Need a Custom Engineering Solution?
          </h2>
          <p
            className="text-soro-ink mb-8"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Tell us about your project. We'll review the requirements and provide a detailed quotation.
          </p>
          <Link to="/quote" className="btn-primary">
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  </HelmetProvider>
);

export default Services;
