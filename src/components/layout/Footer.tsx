import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Facebook,
  Linkedin,
  Youtube,
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
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
                { icon: Twitter, label: 'Twitter / X', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1C2A3A] border border-[#1E3050]/80 text-[#8A9DB5] hover:text-white hover:border-[#1E6FFF]/50 hover:bg-[#1E6FFF]/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
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
