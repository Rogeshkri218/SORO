import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

const serviceLinks = [
  { label: 'PCB Design', path: '/services/pcb-design' },
  { label: 'PCB Assembly', path: '/services/pcb-assembly' },
  { label: 'Embedded Systems', path: '/services/embedded-systems' },
  { label: '3D Design', path: '/services/3d-design' },
  { label: '3D Printing', path: '/services/3d-printing' },
  { label: 'CNC Machining', path: '/services/cnc-machining' },
  { label: 'Laser Cutting', path: '/services/laser-cutting' },
  { label: 'Sheet Metal', path: '/services/sheet-metal' },
];

const companyLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Industries', path: '/industries' },
  { label: 'Blog', path: '/blog' },
  { label: 'Downloads', path: '/downloads' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Get a Quote', path: '/quote' },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // TODO: Replace with verified company details
  const COMPANY_EMAIL = 'info@sorofabrications.com'; // placeholder
  const COMPANY_PHONE = '+91 [Phone Number]'; // placeholder
  const COMPANY_WHATSAPP = '+91 [WhatsApp Number]'; // placeholder
  const COMPANY_ADDRESS = '[Company Address, City, State, India]'; // placeholder

  return (
    <footer className="bg-[#050E1A] border-t border-[#1E3050]/60">
      {/* Main Footer */}
      <div className="container-soro py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-5">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E6FFF] to-[#00AAFF] rounded-xl" />
                <Cpu className="relative w-5 h-5 text-white" />
              </div>
              <div>
                <span
                  className="text-xl font-extrabold text-white leading-none block"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  SORO
                </span>
                <span
                  className="text-[0.6rem] text-[#8A9DB5] tracking-widest uppercase leading-none block"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Fabrications
                </span>
              </div>
            </Link>
            <p className="text-[#8A9DB5] text-sm leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Integrated engineering solutions spanning PCB design, embedded systems, 3D design, prototyping, and precision fabrication.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                {
                  label: 'LinkedIn',
                  href: '#',
                  svg: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ),
                },
                {
                  label: 'X / Twitter',
                  href: '#',
                  svg: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Instagram',
                  href: '#',
                  svg: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  ),
                },
              ].map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1C2A3A] border border-[#1E3050]/80 text-[#8A9DB5] hover:text-white hover:border-[#1E6FFF]/50 hover:bg-[#1E6FFF]/10 transition-all duration-200"
                >
                  {svg}
                </a>
              ))}
            </div>

          </div>

          {/* Services Column */}
          <div>
            <h3
              className="text-white font-semibold text-sm mb-5 tracking-wide"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Services
            </h3>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#8A9DB5] hover:text-[#00AAFF] text-sm transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3
              className="text-white font-semibold text-sm mb-5 tracking-wide"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#8A9DB5] hover:text-[#00AAFF] text-sm transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3
              className="text-white font-semibold text-sm mb-5 tracking-wide"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Contact
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="flex items-start gap-3 text-[#8A9DB5] hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-[#1E6FFF] shrink-0" />
                  <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {COMPANY_EMAIL}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 text-[#8A9DB5] hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-[#1E6FFF] shrink-0" />
                  <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {COMPANY_PHONE}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-[#8A9DB5] hover:text-[#25D366] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mt-0.5 text-[#25D366] shrink-0" />
                  <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    WhatsApp Chat
                  </span>
                  <ExternalLink className="w-3 h-3 mt-1 shrink-0" />
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-[#8A9DB5]">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#1E6FFF] shrink-0" />
                  <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {COMPANY_ADDRESS}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1E3050]/40">
        <div className="container-soro py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#8A9DB5] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            &copy; {currentYear} SORO Fabrications Private Limited. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Use'].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[#8A9DB5] hover:text-white text-xs transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
