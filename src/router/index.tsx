import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

// Lazy-loaded pages
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const PcbDesign = lazy(() => import('@/pages/PcbDesign'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Industries = lazy(() => import('@/pages/Industries'));
const Quote = lazy(() => import('@/pages/Quote'));
const Contact = lazy(() => import('@/pages/Contact'));
const Downloads = lazy(() => import('@/pages/Downloads'));
const Products = lazy(() => import('@/pages/Products'));
const Blog = lazy(() => import('@/pages/Blog'));

// Page loading fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0A1628]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-[#1E6FFF]/30 border-t-[#1E6FFF] rounded-full animate-spin" />
      <span className="text-[#8A9DB5] text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
        Loading…
      </span>
    </div>
  </div>
);

// 404 page
const NotFound: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <div className="text-8xl font-extrabold gradient-text-blue mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
        404
      </div>
      <h1 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Page Not Found
      </h1>
      <p className="text-[#8A9DB5] mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
        The page you're looking for doesn't exist.
      </p>
      <a href="/" className="btn-primary">
        Go Home
      </a>
    </div>
  </div>
);

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pcb-design" element={<PcbDesign />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:slug" element={<ProjectDetail />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/products" element={<Products />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  </BrowserRouter>
);

export default AppRouter;
