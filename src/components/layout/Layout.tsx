import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A1628]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/[WHATSAPP_NUMBER]"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 flex items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:scale-110 transition-all duration-200"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      {/* Floating Quote Button (mobile) */}
      <div className="fixed bottom-6 left-6 z-40 lg:hidden">
        <Link
          to="/quote"
          className="btn-primary shadow-lg shadow-[#1E6FFF]/30 py-3 px-5 text-sm"
        >
          Get a Quote
        </Link>
      </div>
    </div>
  );
};

export default Layout;
