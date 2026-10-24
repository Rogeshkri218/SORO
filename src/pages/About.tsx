import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, Heart, Award, Users, Lightbulb } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const values = [
  {
    icon: Target,
    title: 'Precision',
    desc: 'Clear requirements and careful review should guide every engineering decision.',
    color: '#1E6FFF',
  },
  {
    icon: Heart,
    title: 'Reliability',
    desc: 'Project scope and expectations should be agreed before work begins.',
    color: '#FF6B2B',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    desc: 'We stay current with technology to bring modern engineering approaches to every project.',
    color: '#00AAFF',
  },
  {
    icon: Users,
    title: 'Partnership',
    desc: 'Project collaboration should keep goals, responsibilities, and next steps clear.',
    color: '#6EE7B7',
  },
];

const capabilities = [
  'PCB schematic design and layout',
  'PCB and prototype assembly',
  '3D CAD modelling',
  '3D printing and functional prototyping',
  'Prototype design review',
  'Manufacturing support',
];

const About: React.FC = () => (
  <HelmetProvider>
    <Helmet>
      <title>About Us — SORO Fabrications Private Limited</title>
      <meta
        name="description"
        content="Learn about SORO Fabrications Private Limited and its focus on electronic and mechanical product development."
      />
    </Helmet>

    {/* Hero */}
    <section className="relative pt-36 pb-20 bg-[#0A1628] overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="container-soro relative z-10">
        <ScrollReveal>
          <div className="badge-blue mb-5 w-fit">About Us</div>
          <h1 className="text-display text-white mb-6 max-w-3xl">
            Engineering Excellence,{' '}
            <span className="gradient-text">Built on Expertise</span>
          </h1>
          <p
            className="text-[#8A9DB5] text-lg max-w-2xl leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            SORO Fabrications Private Limited is an engineering and product-development company
            focused on electronic and mechanical product development.
          </p>
        </ScrollReveal>
      </div>
    </section>

    {/* Company Overview */}
    <section className="py-20 bg-[#0D1B2A]">
      <div className="container-soro">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <ScrollReveal>
            <h2 className="text-section-title text-white mb-6">
              Who We <span className="gradient-text-blue">Are</span>
            </h2>
            <p
              className="text-[#8A9DB5] leading-relaxed mb-5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              SORO Fabrications Private Limited focuses on electronic and mechanical product
              development. Potential project scopes are outlined here and confirmed individually.
            </p>
            <p
              className="text-[#8A9DB5] leading-relaxed mb-5"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              The company is building toward its own product range. No commercial products or
              customer case studies have been confirmed for publication yet.
            </p>
            <p
              className="text-[#8A9DB5] leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {/* Placeholder — replace with verified company history */}
              <em className="text-[#8A9DB5]/60 text-sm">
                [Additional company history and background — to be provided by the company]
              </em>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            {/* Mission & Vision */}
            <div className="space-y-5">
              <div className="glass p-7 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#1E6FFF]/15 border border-[#1E6FFF]/30 flex items-center justify-center">
                    <Target className="w-4 h-4 text-[#1E6FFF]" />
                  </div>
                  <h3
                    className="text-white font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Our Mission
                  </h3>
                </div>
                <p
                  className="text-[#8A9DB5] text-sm leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  To turn engineering ideas into carefully scoped product-development work.
                </p>
              </div>

              <div className="glass p-7 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#FF6B2B]/15 border border-[#FF6B2B]/30 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-[#FF6B2B]" />
                  </div>
                  <h3
                    className="text-white font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Our Vision
                  </h3>
                </div>
                <p
                  className="text-[#8A9DB5] text-sm leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  To build a product range alongside electronic and mechanical product development.
                </p>
              </div>

              <div className="glass p-7 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#00AAFF]/15 border border-[#00AAFF]/30 flex items-center justify-center">
                    <Award className="w-4 h-4 text-[#00AAFF]" />
                  </div>
                  <h3
                    className="text-white font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Certifications & Achievements
                  </h3>
                </div>
                <p
                  className="text-[#8A9DB5] text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <em className="text-[#8A9DB5]/60">
                    [Certifications, awards, and achievements — to be provided by the company once verified]
                  </em>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    {/* Capabilities */}
    <section className="py-20 bg-[#0A1628]">
      <div className="container-soro">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-section-title text-white mb-4">
            Technical <span className="gradient-text">Capabilities</span>
          </h2>
          <p
            className="text-[#8A9DB5] max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Potential project scopes are listed for discussion. Availability and deliverables are
            confirmed after reviewing each enquiry.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap, i) => (
            <ScrollReveal key={cap} delay={i * 0.05}>
              <div className="glass-light p-4 rounded-xl flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1E6FFF]/20 border border-[#1E6FFF]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1E6FFF]" />
                </div>
                <span
                  className="text-[#8A9DB5] text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {cap}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-20 bg-[#0D1B2A]">
      <div className="container-soro">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-section-title text-white mb-4">
            Our <span className="gradient-text">Values</span>
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <ScrollReveal key={value.title} delay={i * 0.1}>
              <div className="card-engineering p-7 h-full text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: `${value.color}15`, border: `1px solid ${value.color}30` }}
                >
                  <value.icon className="w-7 h-7" style={{ color: value.color }} />
                </div>
                <h3
                  className="text-white font-bold text-lg mb-3"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-[#8A9DB5] text-sm leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {value.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Team Placeholder */}
    <section className="py-20 bg-[#0A1628]">
      <div className="container-soro">
        <ScrollReveal className="text-center">
          <h2 className="text-section-title text-white mb-4">
            Our <span className="gradient-text">Team</span>
          </h2>
          <p
            className="text-[#8A9DB5] max-w-xl mx-auto mb-8"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Team profiles will be added when verified details are available.
          </p>
          <div className="glass p-10 rounded-2xl max-w-xl mx-auto">
            <p
              className="text-[#8A9DB5]/60 text-sm italic"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              [Team and leadership profiles — to be provided by the company. This section will
              display names, roles, photos, and professional backgrounds once supplied.]
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-[#0D1B2A]">
      <div className="container-soro text-center">
        <ScrollReveal>
          <h2
            className="text-white font-bold text-2xl mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Ready to Work Together?
          </h2>
          <p
            className="text-[#8A9DB5] mb-8 max-w-lg mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Contact us to discuss your project requirements. We'll review the scope and provide
            a detailed quotation.
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

export default About;
