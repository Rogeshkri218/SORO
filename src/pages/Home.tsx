import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const capabilityItems = [
  { title: 'PCB schematic design and layout', output: 'Schematics, board layouts, and fabrication-ready files.' },
  { title: 'PCB and prototype assembly', output: 'A scoped build plan, parts list, and prototype assembly.' },
  { title: '3D CAD modelling', output: 'Parametric models, assemblies, and technical drawings.' },
  { title: '3D printing and functional prototyping', output: 'Fit-check and functional prototype planning.' },
  { title: 'Prototype design review', output: 'Design feedback, risks, and recommended next steps.' },
  { title: 'Manufacturing support', output: 'Documentation and production-readiness planning.' },
];

const processSteps = [
  'Problem understanding',
  'Requirements',
  'Design',
  'Prototype',
  'Testing',
  'Improvement',
  'Production planning',
];

const Home: React.FC = () => (
  <HelmetProvider>
    <Helmet>
      <title>SORO Fabrications | Electronic Product Development &amp; Prototyping</title>
      <meta
        name="description"
        content="Electronic product development, PCB engineering, and rapid prototyping. Discuss your next engineering project with SORO Fabrications."
      />
      <meta property="og:title" content="SORO Fabrications Private Limited" />
      <meta property="og:description" content="Electronic product development, PCB engineering, and rapid prototyping." />
      <meta property="og:type" content="website" />
    </Helmet>

    <section className="bg-[#071321] pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
      <div className="container-soro grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#F47745]">
            Electronic product development · PCB engineering · rapid prototyping
          </p>
          <h1 className="text-hero max-w-2xl text-white">Engineering Ideas Into Products That Work.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#AEB8C4]">
            Electronic product development, PCB engineering and rapid prototyping, with a vision to
            build our own product range.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/products" className="btn-orange">
              Explore Our Products <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-secondary">Discuss Your Project</Link>
          </div>
          <p className="mt-8 text-sm text-[#AEB8C4]">
            SORO Fabrications Private Limited · Design · Fabricate · Innovate
          </p>
        </div>
        <div className="relative min-h-[320px] overflow-hidden border border-white/15 bg-[#0B1F3A] sm:min-h-[460px]">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=82"
            alt="Close-up of an electronic circuit board"
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071321]/75 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.14em] text-white/80">
            Illustrative electronics image
          </p>
        </div>
      </div>
    </section>

    <section className="bg-[#F4F7FA] py-20 text-[#0B1F3A] sm:py-28">
      <div className="container-soro grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#174A7E]">About SORO</p>
          <h2 className="text-display">From engineering question to workable next step.</h2>
        </div>
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed text-[#425466]">
            SORO Fabrications Private Limited is an engineering and product-development company
            focused on electronic and mechanical product development. Project scopes can be discussed
            across electronics, PCB design, CAD, and prototyping.
          </p>
          <Link to="/about" className="mt-7 inline-flex items-center gap-2 font-semibold text-[#174A7E] hover:text-[#F47745]">
            About the company <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    <section className="bg-white py-20 text-[#0B1F3A] sm:py-28">
      <div className="container-soro">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#174A7E]">Capabilities to discuss</p>
            <h2 className="text-section-title">Engineering support, scoped to your project.</h2>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 font-semibold text-[#174A7E] hover:text-[#F47745]">
            View capabilities <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {capabilityItems.map((item, index) => (
            <article key={item.title} className="border-t border-[#D6DEE7] py-6">
              <p className="mb-4 font-mono text-sm text-[#F47745]">0{index + 1}</p>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 min-h-12 leading-relaxed text-[#5B6876]">{item.output}</p>
              <Link to="/quote" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#174A7E] hover:text-[#F47745]">
                Enquire <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-5 max-w-3xl text-sm text-[#5B6876]">
          These are potential project scopes. Availability, deliverables, and production arrangements
          are confirmed after reviewing each enquiry.
        </p>
      </div>
    </section>

    <section className="bg-[#0B1F3A] py-20 text-white sm:py-24">
      <div className="container-soro grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#F47745]">SORO products</p>
          <h2 className="text-display">A product range is a vision, not a catalogue yet.</h2>
        </div>
        <div className="border-l-2 border-[#F47745] pl-6">
          <p className="leading-relaxed text-[#D4DCE5]">
            No product names or availability have been verified for publication. When products are
            ready to share, each listing will show whether it is a concept, prototype, pilot, or
            available product.
          </p>
          <Link to="/products" className="mt-6 inline-flex items-center gap-2 font-semibold text-white hover:text-[#F47745]">
            Product updates <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    <section className="bg-[#E9EEF3] py-20 text-[#0B1F3A] sm:py-24">
      <div className="container-soro">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#174A7E]">Selected projects</p>
        <div className="grid gap-8 border-y border-[#C9D2DC] py-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-section-title">Case studies will feature verified SORO work.</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-[#536273]">
              Project records and approved images have not been provided for publication. We will
              add case studies when the work, contribution, and shareable results are confirmed.
            </p>
          </div>
          <Link to="/portfolio" className="inline-flex items-center gap-2 font-semibold text-[#174A7E] hover:text-[#F47745]">
            Project updates <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    <section className="bg-white py-20 text-[#0B1F3A] sm:py-24">
      <div className="container-soro">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#174A7E]">Product development process</p>
        <h2 className="text-section-title mb-10">A clear path from problem to production planning.</h2>
        <ol className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <li key={step} className="border-t border-[#C9D2DC] py-5 pr-5">
              <span className="font-mono text-sm text-[#F47745]">0{index + 1}</span>
              <p className="mt-3 font-semibold">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="bg-[#F4F7FA] py-16 text-[#0B1F3A]">
      <div className="container-soro flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#174A7E]">Start a conversation</p>
          <h2 className="mt-2 text-3xl font-bold">What are you working on?</h2>
        </div>
        <Link to="/quote" className="btn-orange">Request a Quote <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
      </div>
    </section>
  </HelmetProvider>
);

export default Home;
