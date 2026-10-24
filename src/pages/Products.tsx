import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers3 } from 'lucide-react';

const Products: React.FC = () => (
  <HelmetProvider>
    <Helmet>
      <title>Products | SORO Fabrications</title>
      <meta
        name="description"
        content="Explore products developed by SORO Fabrications. Contact the team to discuss an electronic product idea."
      />
    </Helmet>
    <section className="min-h-[70vh] bg-[#071321] px-5 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#F47745]">
          SORO products
        </p>
        <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-6xl">
          Products in development deserve honest labels.
        </h1>
        <div className="mt-12 grid gap-6 border-y border-white/15 py-8 md:grid-cols-[auto_1fr] md:items-start">
          <Layers3 aria-hidden="true" className="h-8 w-8 text-[#AEB8C4]" />
          <div>
            <h2 className="text-xl font-semibold">No verified product listings yet</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-[#AEB8C4]">
              Product names and availability have not been confirmed for publication. This page will list
              SORO products when their status and specifications are ready to share.
            </p>
            <Link to="/contact" className="btn-orange mt-6">
              Discuss a product idea <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  </HelmetProvider>
);

export default Products;