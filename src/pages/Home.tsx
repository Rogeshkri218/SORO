import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  ChevronDown,
  CheckCircle,
  Cpu,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Lightbulb,
  Package,
  MessageSquare,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ServiceCard from '@/components/shared/ServiceCard';
import ProjectCard from '@/components/shared/ProjectCard';
import { services } from '@/data/services';
import { projects } from '@/data/projects';

// Lazy load 3D scene
const HeroScene = lazy(() => import('@/components/3d/HeroScene'));

// ==========================================
// Hero Section
// ==========================================
const HeroSection: React.FC = () => (
  <section
    className="relative min-h-screen flex items-center overflow-hidden pt-20"
    aria-label="Hero"
  >
    {/* Background */}
    <div className="absolute inset-0 bg-[#0A1628]">
      <div className="absolute inset-0 bg-circuit-pattern opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1E6FFF]/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00AAFF]/8 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-[#FF6B2B]/6 rounded-full blur-2xl" />
    </div>

    <div className="container-soro relative z-10 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Text Content */}
        <div>
          <ScrollReveal delay={0.1}>
            <div className="badge-blue mb-6 w-fit">
              <Zap className="w-3.5 h-3.5" />
              Engineering Solutions, End-to-End
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-hero text-white mb-6">
              From Engineering{' '}
              <span className="gradient-text">Ideas</span>{' '}
              to Real-World{' '}
              <span className="gradient-text-blue">Products</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p
              className="text-[#8A9DB5] text-lg leading-relaxed mb-8 max-w-lg"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Integrated engineering solutions spanning PCB design, embedded systems, 3D design,
              prototyping, and precision fabrication — all under one roof.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/services" className="btn-primary">
                Explore Our Services
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/quote" className="btn-orange">
                Request a Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="flex flex-wrap gap-6">
              {[
                { label: 'PCB Design', icon: '⚡' },
                { label: 'Embedded Systems', icon: '🔧' },
                { label: '3D Printing', icon: '🖨️' },
                { label: 'CNC & Fabrication', icon: '⚙️' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-sm">{item.icon}</span>
                  <span
                    className="text-[#8A9DB5] text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Right: 3D Scene */}
        <ScrollReveal delay={0.3} direction="left" className="h-[500px] lg:h-[580px] w-full">
          <div className="w-full h-full relative">
            {/* Glow backdrop */}
            <div className="absolute inset-0 bg-gradient-radial from-[#1E6FFF]/15 via-transparent to-transparent rounded-3xl" />
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-[#8A9DB5] text-sm animate-pulse" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Loading 3D Scene…
                  </div>
                </div>
              }
            >
              <HeroScene />
            </Suspense>
          </div>
        </ScrollReveal>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#8A9DB5]">
        <ChevronDown className="w-6 h-6" />
      </div>
    </div>
  </section>
);

// ==========================================
// Company Introduction
// ==========================================
const CompanyIntro: React.FC = () => (
  <section className="py-20 bg-[#0D1B2A]" aria-label="Company Introduction">
    <div className="container-soro">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <ScrollReveal>
          <div className="badge-orange mb-4 w-fit">About SORO Fabrications</div>
          <h2 className="text-display text-white mb-6">
            Precision Engineering,{' '}
            <span className="gradient-text-blue">Delivered</span>
          </h2>
          <p
            className="text-[#8A9DB5] text-base leading-relaxed mb-5"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            SORO Fabrications Private Limited is an engineering and technology company specialising
            in end-to-end product development — from concept and design through to physical
            prototypes and production-ready components.
          </p>
          <p
            className="text-[#8A9DB5] text-base leading-relaxed mb-8"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Our integrated capabilities span PCB design and assembly, embedded firmware development,
            3D design and printing, CNC machining, laser cutting, and sheet metal fabrication —
            enabling us to support complex engineering projects from a single, reliable partner.
          </p>
          <Link to="/about" className="btn-primary w-fit">
            Learn More About Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="left">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Integrated Services', desc: 'PCB, firmware, mechanical, and fabrication in one team.', icon: Package },
              { label: 'Technical Depth', desc: 'Engineering expertise across electronics, software, and manufacturing.', icon: Cpu },
              { label: 'Fast Turnaround', desc: 'Efficient workflows that move from design to prototype quickly.', icon: Clock },
              { label: 'Custom Solutions', desc: 'Every project is engineered to meet your specific requirements.', icon: Lightbulb },
            ].map((item, i) => (
              <div key={item.label} className="glass-light p-5 rounded-xl">
                <item.icon
                  className="w-6 h-6 mb-3"
                  style={{ color: i % 2 === 0 ? '#1E6FFF' : '#FF6B2B' }}
                />
                <h4
                  className="text-white font-semibold text-sm mb-1.5"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {item.label}
                </h4>
                <p
                  className="text-[#8A9DB5] text-xs leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

// ==========================================
// Featured Services
// ==========================================
const FeaturedServices: React.FC = () => (
  <section className="py-20 bg-[#0A1628]" aria-label="Our Services">
    <div className="container-soro">
      <ScrollReveal className="text-center mb-12">
        <div className="badge-blue mb-4 mx-auto w-fit">What We Do</div>
        <h2 className="text-section-title text-white mb-4">
          Engineering <span className="gradient-text">Services</span>
        </h2>
        <p
          className="text-[#8A9DB5] max-w-2xl mx-auto"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          From electronic design to physical fabrication, our services cover the full engineering
          and manufacturing spectrum.
        </p>
      </ScrollReveal>

      <div className="grid-services mb-10">
        {services.map((service, i) => (
          <ScrollReveal key={service.id} delay={i * 0.07}>
            <ServiceCard service={service} variant="compact" />
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal className="text-center">
        <Link to="/services" className="btn-secondary">
          View All Services
          <ArrowRight className="w-4 h-4" />
        </Link>
      </ScrollReveal>
    </div>
  </section>
);

// ==========================================
// Selected Projects
// ==========================================
const SelectedProjects: React.FC = () => {
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-20 bg-[#0D1B2A]" aria-label="Portfolio">
      <div className="container-soro">
        <ScrollReveal className="text-center mb-12">
          <div className="badge-blue mb-4 mx-auto w-fit">Our Work</div>
          <h2 className="text-section-title text-white mb-4">
            Selected <span className="gradient-text">Projects</span>
          </h2>
          <p
            className="text-[#8A9DB5] max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            A selection of engineering projects and prototypes developed by our team.
          </p>
        </ScrollReveal>

        <div className="grid-projects mb-10">
          {featured.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.1}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center">
          <Link to="/portfolio" className="btn-primary">
            View Full Portfolio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

// ==========================================
// Industries
// ==========================================
const IndustriesSection: React.FC = () => {
  const industries = [
    { icon: '🏥', label: 'Medical Devices', path: '/industries#medical' },
    { icon: '🏭', label: 'Industrial Automation', path: '/industries#industrial' },
    { icon: '🌾', label: 'Agriculture', path: '/industries#agriculture' },
    { icon: '📡', label: 'IoT', path: '/industries#iot' },
    { icon: '🎓', label: 'Education', path: '/industries#education' },
    { icon: '🔬', label: 'Research & Development', path: '/industries#research' },
  ];

  return (
    <section className="py-20 bg-[#0A1628]" aria-label="Industries Served">
      <div className="container-soro">
        <ScrollReveal className="text-center mb-12">
          <div className="badge-blue mb-4 mx-auto w-fit">Industries</div>
          <h2 className="text-section-title text-white mb-4">
            Industries We <span className="gradient-text">Serve</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map((ind, i) => (
            <ScrollReveal key={ind.label} delay={i * 0.07}>
              <Link
                to={ind.path}
                className="glass-light p-5 rounded-xl text-center hover:border-[#1E6FFF]/30 transition-all duration-300 hover:-translate-y-1 block group"
              >
                <div className="text-3xl mb-3">{ind.icon}</div>
                <span
                  className="text-[#8A9DB5] text-xs group-hover:text-white transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {ind.label}
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-8">
          <Link to="/industries" className="btn-secondary">
            View All Industries
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

// ==========================================
// Why Choose Us
// ==========================================
const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: Package,
      title: 'End-to-End Capability',
      desc: 'From schematic design to fabricated enclosure — we cover the complete product development cycle in one team.',
      color: '#1E6FFF',
    },
    {
      icon: Zap,
      title: 'Faster Iterations',
      desc: 'Integrated design and prototyping workflows reduce the time from concept to working prototype.',
      color: '#FF6B2B',
    },
    {
      icon: Shield,
      title: 'Engineering Reliability',
      desc: 'We apply rigorous design practices including DFM review, testing, and documentation for every project.',
      color: '#00AAFF',
    },
    {
      icon: TrendingUp,
      title: 'Cost-Conscious Solutions',
      desc: 'Practical, effective engineering decisions that deliver quality results within project budgets.',
      color: '#6EE7B7',
    },
    {
      icon: MessageSquare,
      title: 'Clear Communication',
      desc: 'Regular updates, transparent timelines, and responsive support throughout every engagement.',
      color: '#C4B5FD',
    },
    {
      icon: Users,
      title: 'Technical Partnership',
      desc: 'We work as a true technical partner — understanding your goals and engineering alongside your team.',
      color: '#FCD34D',
    },
  ];

  return (
    <section className="py-20 bg-[#0D1B2A]" aria-label="Why Choose Us">
      <div className="container-soro">
        <ScrollReveal className="text-center mb-12">
          <div className="badge-blue mb-4 mx-auto w-fit">Why SORO</div>
          <h2 className="text-section-title text-white mb-4">
            Why Choose <span className="gradient-text">SORO Fabrications</span>
          </h2>
          <p
            className="text-[#8A9DB5] max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            We bring together engineering expertise, fabrication capability, and a client-focused
            approach that makes us a reliable partner for demanding projects.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <ScrollReveal key={reason.title} delay={i * 0.08}>
              <div className="card-engineering p-6 h-full">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${reason.color}15`, border: `1px solid ${reason.color}30` }}
                >
                  <reason.icon className="w-5 h-5" style={{ color: reason.color }} />
                </div>
                <h3
                  className="text-white font-semibold text-base mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {reason.title}
                </h3>
                <p
                  className="text-[#8A9DB5] text-sm leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {reason.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// Workflow Section
// ==========================================
const WorkflowSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Enquiry & Scoping',
      desc: 'Share your project requirements. We review specifications, ask the right questions, and scope the work accurately.',
    },
    {
      number: '02',
      title: 'Design & Engineering',
      desc: 'Our team produces schematics, PCB layouts, 3D CAD models, and firmware architecture to your specification.',
    },
    {
      number: '03',
      title: 'Prototyping',
      desc: 'We build functional prototypes — assembled PCBs, 3D-printed enclosures, and integrated systems — for validation.',
    },
    {
      number: '04',
      title: 'Testing & Validation',
      desc: 'Rigorous functional testing, fit checks, and debugging ensure the prototype performs as designed.',
    },
    {
      number: '05',
      title: 'Production Support',
      desc: 'Refined designs, production files, and fabrication support to take your product from prototype to production.',
    },
  ];

  return (
    <section className="py-20 bg-[#0A1628]" aria-label="Our Process">
      <div className="container-soro">
        <ScrollReveal className="text-center mb-14">
          <div className="badge-blue mb-4 mx-auto w-fit">Our Process</div>
          <h2 className="text-section-title text-white mb-4">
            From Prototype to <span className="gradient-text">Production</span>
          </h2>
          <p
            className="text-[#8A9DB5] max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            A structured engineering workflow that takes your idea from concept to real-world product.
          </p>
        </ScrollReveal>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#1E6FFF]/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1E6FFF]/20 to-[#00AAFF]/10 rounded-2xl border border-[#1E6FFF]/30" />
                  <span
                    className="relative font-extrabold text-xl gradient-text-blue"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  className="text-white font-semibold text-sm mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[#8A9DB5] text-xs leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {step.desc}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// Quote CTA Banner
// ==========================================
const QuoteCTA: React.FC = () => (
  <section
    className="relative py-24 overflow-hidden"
    aria-label="Call to Action"
    style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #0A1628 50%, #0D1B2A 100%)' }}
  >
    <div className="absolute inset-0">
      <div className="bg-grid-pattern absolute inset-0 opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#1E6FFF]/6 rounded-full blur-3xl" />
    </div>
    <div className="container-soro relative z-10 text-center">
      <ScrollReveal>
        <div className="badge-blue mb-6 mx-auto w-fit">Start Your Project</div>
        <h2
          className="text-display text-white mb-6 max-w-3xl mx-auto"
        >
          Ready to Engineer Your{' '}
          <span className="gradient-text">Next Product?</span>
        </h2>
        <p
          className="text-[#8A9DB5] text-lg mb-10 max-w-2xl mx-auto"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Tell us about your project. Our engineering team will review your requirements and
          provide a detailed quotation.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/quote" className="btn-primary">
            Request a Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </ScrollReveal>

      {/* Trust Signals */}
      <ScrollReveal delay={0.2}>
        <div className="mt-14 flex flex-wrap justify-center gap-8">
          {[
            { icon: CheckCircle, text: 'Free project consultation' },
            { icon: CheckCircle, text: 'Detailed technical review' },
            { icon: CheckCircle, text: 'Transparent quotation' },
            { icon: CheckCircle, text: 'No obligation to proceed' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-[#1E6FFF]" />
              <span
                className="text-[#8A9DB5] text-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

// ==========================================
// Home Page
// ==========================================
const Home: React.FC = () => (
  <HelmetProvider>
    <Helmet>
      <title>SORO Fabrications Private Limited — Engineering Solutions End-to-End</title>
      <meta
        name="description"
        content="SORO Fabrications Private Limited offers integrated engineering solutions: PCB design, PCB assembly, embedded systems, 3D design, 3D printing, CNC machining, laser cutting, and sheet metal fabrication."
      />
      <meta property="og:title" content="SORO Fabrications Private Limited" />
      <meta
        property="og:description"
        content="From Engineering Ideas to Real-World Products — precision engineering and fabrication services."
      />
      <meta property="og:type" content="website" />
    </Helmet>

    <HeroSection />
    <CompanyIntro />
    <FeaturedServices />
    <SelectedProjects />
    <IndustriesSection />
    <WhyChooseUs />
    <WorkflowSection />
    <QuoteCTA />
  </HelmetProvider>
);

export default Home;
