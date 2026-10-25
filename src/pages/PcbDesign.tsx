import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Box,
  Check,
  CircleHelp,
  ClipboardList,
  Cpu,
  FileText,
  Layers,
  Workflow,
} from 'lucide-react';

const serviceCards = [
  {
    title: 'PCB Schematic Design',
    enquiry: 'PCB Schematic Design',
    status: 'Discuss project scope',
    summary: 'Turn functional needs and circuit concepts into a structured schematic for review.',
    requirements: 'Application, expected inputs and outputs, power needs, known components, and any existing circuit notes.',
    deliverables: 'Schematic source and design notes, when included in the agreed scope.',
    icon: Cpu,
  },
  {
    title: 'PCB Layout Design',
    enquiry: 'PCB Layout',
    status: 'Discuss project scope',
    summary: 'Plan board placement, routing, dimensions, connectors, layers, and manufacturing considerations.',
    requirements: 'Approved schematic, board outline, connectors, mechanical constraints, and layer or impedance requirements if known.',
    deliverables: 'PCB layout source, fabrication outputs, and revision notes as agreed.',
    icon: Layers,
  },
  {
    title: 'PCB Prototype Assembly',
    enquiry: 'Prototype Assembly',
    status: 'Available on confirmation',
    summary: 'Discuss prototype assembly and component integration needs for a design under development.',
    requirements: 'BOM, assembly files, quantities, component sourcing preferences, and inspection or test expectations.',
    deliverables: 'Assembly coordination or prototype build only where confirmed in the project quotation.',
    icon: ClipboardList,
  },
  {
    title: 'Embedded Electronics',
    enquiry: 'Electronic Product Development',
    status: 'Available on confirmation',
    summary: 'Discuss microcontroller-based electronics and integration as part of an electronic product concept.',
    requirements: 'Functional requirements, preferred controller or interfaces, firmware boundaries, and system diagram if available.',
    deliverables: 'Hardware integration notes and related design files only when agreed; firmware scope is confirmed separately.',
    icon: Workflow,
  },
  {
    title: '3D CAD and Enclosure Design',
    enquiry: '3D CAD or 3D Printing',
    status: 'Discuss project scope',
    summary: 'Coordinate mechanical concepts with board size, connectors, mounting points, and enclosure constraints.',
    requirements: 'Board outline, component heights, connector access, enclosure envelope, and existing mechanical files.',
    deliverables: 'CAD models, fit-check outputs, or drawings when included in the agreed scope.',
    icon: Box,
  },
  {
    title: '3D Printing and Prototyping',
    enquiry: '3D CAD or 3D Printing',
    status: 'Available on confirmation',
    summary: 'Review whether a physical prototype can support fit checks or design iteration.',
    requirements: 'Model or drawing, intended use, quantity, material constraints, and required validation.',
    deliverables: 'Prototype planning or printed parts only after equipment, process, and scope are confirmed.',
    icon: FileText,
  },
];

const workflow = [
  {
    title: 'Requirement Discussion',
    needs: 'Application, objective, constraints, target quantity, and known deadlines.',
    work: 'Clarify goals, existing material, interfaces, and intended use.',
    approval: 'Confirm the written requirement summary before feasibility review.',
  },
  {
    title: 'Technical Feasibility Review',
    needs: 'Block diagram, circuit concept, power details, environmental conditions, and unknowns.',
    work: 'Identify dependencies, risks, information gaps, and a plausible project boundary.',
    approval: 'Agree what is in scope and what needs separate investigation.',
  },
  {
    title: 'Schematic and Design Planning',
    needs: 'Functional requirements, component preferences, interfaces, and existing BOM if any.',
    work: 'Plan the circuit structure and key component decisions where included.',
    approval: 'Review the design direction before detailed layout work.',
  },
  {
    title: 'PCB Layout and Design Review',
    needs: 'Approved schematic, board outline, connector locations, and mechanical constraints.',
    work: 'Develop placement and routing; review board dimensions and manufacturing considerations.',
    approval: 'Review layout views and capture requested feedback.',
  },
  {
    title: 'Customer Feedback and Revisions',
    needs: 'Consolidated review comments and any requirement changes.',
    work: 'Revise agreed design items and record design changes.',
    approval: 'Approve the revision and confirm remaining included review rounds.',
  },
  {
    title: 'Design File Preparation',
    needs: 'Approved design revision and the deliverable list in the quotation.',
    work: 'Prepare agreed source files and manufacturing outputs.',
    approval: 'Confirm revision identifiers and file handoff.',
  },
  {
    title: 'Prototype Coordination',
    needs: 'Quantity, BOM, assembly requirements, and delivery arrangement.',
    work: 'Coordinate fabrication or assembly only where separately agreed; external partners may be involved.',
    approval: 'Approve supplier, build scope, and costs before any order is placed.',
  },
  {
    title: 'Testing and Improvement',
    needs: 'Acceptance criteria, test setup, and required evidence.',
    work: 'Testing, reports, and iteration happen only when included in the project scope.',
    approval: 'Agree test results and next changes; no physical testing is implied by design-file delivery.',
  },
];

const customerInputs = [
  'Project objective and intended application',
  'Functional requirements and expected behaviour',
  'Block diagram, circuit concept, or existing design',
  'Supply voltage and current requirements',
  'Required interfaces, connectors, and signals',
  'Approximate PCB dimensions or board outline',
  'Operating environment and conditions',
  'Component preferences or existing BOM',
  'Layer count or impedance needs, if known',
  'Mechanical and enclosure constraints',
  'Target quantity and expected use',
  'Required design files and deliverables',
];

const deliverables = [
  'Schematic source files',
  'PCB layout source files',
  'Gerber or fabrication outputs',
  'Drill files',
  'Bill of Materials (BOM)',
  'Pick-and-place files',
  'Assembly drawings',
  '3D board previews or mechanical files',
  'Design notes and revision documentation',
  'Prototype or test reports, when included',
];

const applicationAreas = [
  'Industrial monitoring and control',
  'IoT and sensor devices',
  'Electronic controllers',
  'Energy monitoring concepts',
  'Embedded electronic products',
  'Research and prototype development',
];

const faqs = [
  {
    question: 'What information is needed to begin a PCB project?',
    answer: 'A short description of the objective, intended use, functional requirements, power needs, interfaces, board constraints, target quantity, and any existing design files is a useful start. Not every project needs every item; requirements are reviewed before a quotation.',
  },
  {
    question: 'What is the difference between schematic design and PCB layout?',
    answer: 'A schematic describes electrical connections and circuit intent. PCB layout places components and routes those connections on a physical board while considering dimensions, connectors, layers, and manufacturing constraints.',
  },
  {
    question: 'Which deliverables can be requested?',
    answer: 'Source files, fabrication outputs, BOM, placement data, drawings, and revision notes may be included depending on the design tools, project scope, and written quotation.',
  },
  {
    question: 'Can existing PCB designs be reviewed?',
    answer: 'You can describe the review you need and share non-confidential details first. Review availability, file handling, deliverables, and any confidentiality terms must be agreed before sending sensitive design files.',
  },
  {
    question: 'Can prototype development be discussed?',
    answer: 'Yes. Prototype assembly, sourcing, fabrication, and physical testing are separate activities from PCB design and are considered only when the relevant capability, partner arrangement, and project scope are confirmed.',
  },
  {
    question: 'How is project scope and pricing determined?',
    answer: 'Pricing depends on requirements, design complexity, deliverables, revision expectations, quantities, and any fabrication or assembly coordination. A quotation follows review of the actual project inputs.',
  },
  {
    question: 'Can customers request revisions?',
    answer: 'Revision expectations and included review rounds are defined in the project quotation. Requirement changes after approval may affect scope, cost, and schedule.',
  },
  {
    question: 'How should confidential project files be shared?',
    answer: 'Do not attach confidential designs to the public enquiry form. Ask SORO to agree a suitable secure transfer method and any required confidentiality terms before sharing sensitive files.',
  },
];

const PcbDesign: React.FC = () => (
  <HelmetProvider>
    <Helmet>
      <title>PCB Design &amp; Electronic Product Development | SORO Fabrications</title>
      <meta
        name="description"
        content="Discuss PCB schematic design, layout, prototype planning, and electronic product development with SORO Fabrications. Scope and availability are confirmed per project."
      />
      <meta property="og:title" content="PCB Design & Electronic Product Development | SORO Fabrications" />
      <meta property="og:description" content="PCB engineering and electronic product-development support, scoped to each project." />
    </Helmet>

    <section className="bg-soro-ivory pb-16 pt-32 text-soro-blue sm:pb-24 sm:pt-40">
      <div className="container-soro grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="max-w-3xl min-w-0">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-soro-coral">
            PCB engineering · product development · prototype planning
          </p>
          <h1 className="text-hero">PCB Design &amp; Electronic Product Development</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-soro-ink">
            From circuit concepts and PCB layouts to prototype development, SORO aims to help turn
            engineering requirements into practical electronic products.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/quote?enquiry=PCB%20Schematic%20Design" className="btn-orange">
              Discuss Your PCB Project <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a href="#engineering-capabilities" className="btn-secondary">
              Explore Engineering Capabilities
            </a>
          </div>
          <p className="mt-6 text-sm text-soro-ink">
            Project scope, deliverables, manufacturing arrangements, and availability are confirmed individually.
          </p>
        </div>
        <div className="relative flex min-h-[240px] min-w-0 flex-col items-center justify-center border border-soro-border bg-soro-white/40 p-8 text-center sm:aspect-[4/3] sm:min-h-[300px]">
          <div className="absolute inset-4 border border-dashed border-soro-border" aria-hidden="true" />
          <Cpu className="mb-5 h-10 w-10 text-soro-blue" aria-hidden="true" />
          <p className="max-w-xs text-lg font-semibold text-soro-blue">PCB image placeholder</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-soro-ink">
            Replace with an approved SORO PCB or engineering photograph before launch.
          </p>
          <span className="mt-6 border border-soro-border px-3 py-1 text-xs uppercase tracking-wider text-soro-ink">
            Placeholder, not project imagery
          </span>
        </div>
      </div>
    </section>

    <section className="bg-soro-ivory py-16 text-soro-blue sm:py-20">
      <div className="container-soro grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-blue">Who this is for</p>
          <h2 className="text-section-title">Start with the problem you need to solve.</h2>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-soro-ink">
            Startups, product developers, businesses, engineers, and organisations can bring an
            early concept, an existing circuit, or a defined electronic requirement for discussion.
            SORO reviews the brief before confirming whether the requested design work fits its
            current capabilities.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-soro-ink">
            PCB design, board fabrication, component assembly, and physical testing are distinct
            activities. A design enquiry does not automatically include fabrication, assembly, or testing.
          </p>
        </div>
      </div>
    </section>

    <section id="engineering-capabilities" className="bg-soro-ivory py-20 text-soro-blue sm:py-24">
      <div className="container-soro">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-blue">Engineering capabilities</p>
          <h2 className="text-section-title">A clear scope before work begins.</h2>
          <p className="mt-4 leading-relaxed text-soro-ink">
            These categories describe possible project discussions, not guaranteed services. Availability, equipment, partner involvement, and deliverables are confirmed in writing for each enquiry.
          </p>
        </div>
        <div className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map(({ title, enquiry, status, summary, requirements, deliverables: outputs, icon: Icon }) => (
            <article key={title} className="border-t border-soro-border py-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <Icon className="h-7 w-7 shrink-0 text-soro-blue" aria-hidden="true" />
                <span className="border border-soro-blue/20 px-2.5 py-1 text-xs text-soro-blue">{status}</span>
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-relaxed text-soro-ink">{summary}</p>
              <dl className="mt-5 space-y-4 border-t border-soro-border pt-4 text-sm">
                <div>
                  <dt className="font-semibold text-soro-blue">Typical inputs</dt>
                  <dd className="mt-1 leading-relaxed text-soro-ink">{requirements}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-soro-blue">Potential deliverables</dt>
                  <dd className="mt-1 leading-relaxed text-soro-ink">{outputs}</dd>
                </div>
              </dl>
              <Link to={`/quote?enquiry=${encodeURIComponent(enquiry)}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-soro-blue hover:text-soro-coral">
                Discuss This Service <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-soro-blue py-20 text-soro-white sm:py-24">
      <div className="container-soro">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-coral">PCB design workflow</p>
          <h2 className="text-section-title text-soro-white">Eight review points, with approvals at each handoff.</h2>
          <p className="mt-4 leading-relaxed text-soro-white/85">
            The sequence is a planning guide. Fabrication, assembly, supplier coordination, and physical testing are separate work and occur only when agreed.
          </p>
        </div>
        <ol className="grid gap-4 lg:grid-cols-2">
          {workflow.map((step, index) => (
            <li key={step.title} className="grid gap-4 border border-soro-white/25 bg-soro-white/10 p-5 sm:grid-cols-[3rem_1fr] sm:p-6">
              <span className="font-mono text-sm text-soro-coral">0{index + 1}</span>
              <div>
                <h3 className="text-soro-white text-lg font-semibold">{step.title}</h3>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="font-semibold text-soro-white">Information needed</dt>
                    <dd className="mt-1 leading-relaxed text-soro-white/85">{step.needs}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-soro-white">Work that may happen</dt>
                    <dd className="mt-1 leading-relaxed text-soro-white/85">{step.work}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-soro-white">Approval expected</dt>
                    <dd className="mt-1 leading-relaxed text-soro-white/85">{step.approval}</dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="bg-soro-ivory py-20 text-soro-blue sm:py-24">
      <div className="container-soro grid gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-blue">Prepare for a PCB enquiry</p>
          <h2 className="text-section-title">Useful technical inputs</h2>
          <p className="mt-4 leading-relaxed text-soro-ink">
            Not every project needs every item. Share what is known; requirements will be reviewed before quotation.
          </p>
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {customerInputs.map((input) => (
            <li key={input} className="flex gap-3 border-t border-soro-border py-3 text-sm leading-relaxed text-soro-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-soro-blue" aria-hidden="true" />
              {input}
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="bg-soro-ivory py-20 text-soro-blue sm:py-24">
      <div className="container-soro">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-blue">Technical handoff</p>
          <h2 className="text-section-title">Possible design deliverables</h2>
          <p className="mt-4 text-sm leading-relaxed text-soro-ink">
            Included only when agreed in the project scope. File formats and source-file availability depend on the selected tools and written agreement.
          </p>
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((deliverable) => (
            <li key={deliverable} className="flex gap-3 border-t border-soro-border py-4 text-sm text-soro-ink">
              <FileText className="h-4 w-4 shrink-0 text-soro-blue" aria-hidden="true" />
              {deliverable}
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="bg-soro-ivory py-16 text-soro-blue sm:py-20">
      <div className="container-soro grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-blue">Possible applications</p>
          <h2 className="text-section-title">Use cases to discuss, not a project record.</h2>
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {applicationAreas.map((area) => (
            <li key={area} className="flex gap-3 border-t border-soro-border py-4 text-sm text-soro-ink">
              <Check className="h-4 w-4 shrink-0 text-soro-blue" aria-hidden="true" />
              {area}
            </li>
          ))}
        </ul>
      </div>
      <p className="container-soro mt-5 text-xs text-soro-ink">
        These examples are illustrative. They do not claim sector experience, completed projects, or regulatory capability.
      </p>
    </section>

    <section className="bg-soro-ivory py-20 text-soro-blue sm:py-24">
      <div className="container-soro grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-coral">SORO products</p>
          <h2 className="text-section-title">Product concepts need a verified status before they become listings.</h2>
        </div>
        <div>
          <p className="leading-relaxed text-soro-ink">
            No SORO-owned product status or specifications have been verified for publication. Concepts, prototypes, pilots, and available products will be listed separately when confirmed.
          </p>
          <Link to="/products" className="mt-5 inline-flex items-center gap-2 font-semibold text-soro-blue hover:text-soro-coral">
            Product information <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    <section className="bg-soro-ivory py-16 text-soro-blue sm:py-20">
      <div className="container-soro grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-blue">Project portfolio</p>
          <h2 className="text-section-title">Case studies require confirmed details and approved images.</h2>
        </div>
        <div className="border-l-2 border-soro-coral pl-5">
          <p className="leading-relaxed text-soro-ink">Project details to be added. No customer, outcome, or project image is presented here until verified and approved for publication.</p>
          <Link to="/portfolio" className="mt-5 inline-flex items-center gap-2 font-semibold text-soro-blue hover:text-soro-coral">
            View projects <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    <section className="bg-soro-ivory py-20 text-soro-blue sm:py-24">
      <div className="container-soro grid gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-blue">Working approach</p>
          <h2 className="text-section-title">Good engineering starts with clear decisions.</h2>
        </div>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {[
            'Understand requirements before design begins',
            'Agree review and approval milestones',
            'Document the deliverables in scope',
            'Make design changes through review',
            'Keep prototype work distinct from design work',
            'Confirm supplier and testing arrangements in advance',
          ].map((item) => (
            <li key={item} className="flex gap-3 border-t border-soro-border py-4 text-sm text-soro-ink">
              <Check className="h-4 w-4 shrink-0 text-soro-blue" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="bg-soro-blue py-20 text-soro-white sm:py-24">
      <div className="container-soro grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-soro-coral">Frequently asked questions</p>
          <h2 className="text-section-title text-soro-white">Before you send a PCB enquiry</h2>
        </div>
        <div className="divide-y divide-white/15 border-y border-white/15">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-soro-white marker:hidden">
                {faq.question}
                <CircleHelp className="h-5 w-5 shrink-0 text-soro-coral transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="max-w-3xl pt-4 text-sm leading-relaxed text-soro-white/85">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-soro-ivory py-16 text-soro-blue">
      <div className="container-soro flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-soro-blue">Start a PCB enquiry</p>
          <h2 className="mt-2 text-3xl font-bold">Share what you know. We can clarify the rest.</h2>
        </div>
        <Link to="/quote?enquiry=PCB%20Schematic%20Design" className="btn-orange">
          Discuss Your PCB Project <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  </HelmetProvider>
);

export default PcbDesign;
