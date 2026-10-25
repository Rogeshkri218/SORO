import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(20, 'Please enter a message of at least 20 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  ) : null;

const Contact: React.FC = () => {
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitState('loading');
    try {
      const { VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_CONTACT_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY } = import.meta.env;
      if (!VITE_EMAILJS_SERVICE_ID || !VITE_EMAILJS_CONTACT_TEMPLATE_ID || !VITE_EMAILJS_PUBLIC_KEY) {
        throw new Error('Email delivery is not configured.');
      }
      await emailjs.send(
        VITE_EMAILJS_SERVICE_ID,
        VITE_EMAILJS_CONTACT_TEMPLATE_ID,
        { ...data, to_email: 'orders@sorofabrication.in' },
        { publicKey: VITE_EMAILJS_PUBLIC_KEY },
      );
      setSubmitState('success');
      reset();
    } catch {
      setSubmitState('error');
    }
  };

  const COMPANY_EMAIL = 'orders@sorofabrication.in';

  return (
    <HelmetProvider>
      <Helmet>
        <title>Contact Us — SORO Fabrications Private Limited</title>
        <meta
          name="description"
          content="Contact SORO Fabrications Private Limited by email or submit an enquiry online."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-soro relative z-10">
          <ScrollReveal>
            <div className="badge-blue mb-5 w-fit">Contact</div>
            <h1 className="text-display text-white mb-6 max-w-3xl">
              Let's Talk About{' '}
              <span className="gradient-text">Your Project</span>
            </h1>
            <p
              className="text-[#8A9DB5] text-lg max-w-2xl leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Use the enquiry form or email us directly. Additional contact details will be added when confirmed.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-[#0D1B2A]">
        <div className="container-soro">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <ScrollReveal>
              <div className="space-y-5">
                {/* Email */}
                <a
                  href={`mailto:${COMPANY_EMAIL}`}
                  className="glass p-6 rounded-2xl flex items-start gap-4 hover:border-[#1E6FFF]/30 transition-colors group block"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#1E6FFF]/15 border border-[#1E6FFF]/30 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#1E6FFF]" />
                  </div>
                  <div>
                    <h3
                      className="text-white font-semibold text-sm mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Email
                    </h3>
                    <span
                      className="text-[#8A9DB5] text-sm group-hover:text-[#00AAFF] transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {COMPANY_EMAIL}
                    </span>
                  </div>
                </a>

                <div className="glass p-6 rounded-2xl flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-[#AEB8C4]" aria-hidden="true" />
                  <div>
                    <h3 className="text-white text-sm font-semibold">Business phone</h3>
                    <p className="mt-1 text-sm text-[#AEB8C4]">To be confirmed</p>
                  </div>
                </div>
                <div className="glass p-6 rounded-2xl flex items-start gap-4">
                  <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-[#AEB8C4]" aria-hidden="true" />
                  <div>
                    <h3 className="text-white text-sm font-semibold">WhatsApp</h3>
                    <p className="mt-1 text-sm text-[#AEB8C4]">To be confirmed</p>
                  </div>
                </div>
                <div className="glass p-6 rounded-2xl flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#AEB8C4]" aria-hidden="true" />
                  <div>
                    <h3 className="text-white text-sm font-semibold">Business address</h3>
                    <p className="mt-1 text-sm text-[#AEB8C4]">To be confirmed</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal delay={0.15} className="lg:col-span-2">
              {submitState === 'success' ? (
                <div className="glass p-12 rounded-2xl text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Message Sent!
                  </h2>
                  <p className="text-[#8A9DB5] mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Thank you. Your message was delivered successfully.
                  </p>
                  <button onClick={() => setSubmitState('idle')} className="btn-secondary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="glass p-8 rounded-2xl space-y-5"
                  noValidate
                >
                  <h2 className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Send Us a Message
                  </h2>
                  <div className="divider-glow" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contactName" className="input-label">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="contactName"
                        type="text"
                        className={`input-field ${errors.name ? 'error' : ''}`}
                        placeholder="Your full name"
                        {...register('name')}
                      />
                      <FieldError message={errors.name?.message} />
                    </div>
                    <div>
                      <label htmlFor="contactEmail" className="input-label">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="contactEmail"
                        type="email"
                        className={`input-field ${errors.email ? 'error' : ''}`}
                        placeholder="you@example.com"
                        {...register('email')}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contactSubject" className="input-label">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contactSubject"
                      type="text"
                      className={`input-field ${errors.subject ? 'error' : ''}`}
                      placeholder="What is this about?"
                      {...register('subject')}
                    />
                    <FieldError message={errors.subject?.message} />
                  </div>

                  <div>
                    <label htmlFor="contactMessage" className="input-label">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="contactMessage"
                      rows={6}
                      className={`input-field resize-none ${errors.message ? 'error' : ''}`}
                      placeholder="Tell us how we can help…"
                      {...register('message')}
                    />
                    <FieldError message={errors.message?.message} />
                  </div>

                  {submitState === 'error' && (
                    <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Message delivery failed or is not configured. Please email{' '}
                      <a className="underline" href="mailto:orders@sorofabrication.in">orders@sorofabrication.in</a>.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center py-3"
                    disabled={submitState === 'loading'}
                    id="submitContactButton"
                  >
                    {submitState === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Map Placeholder */}
              <div className="mt-6 glass rounded-2xl overflow-hidden h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-[#8A9DB5]/40 mx-auto mb-2" />
                  <p className="text-[#8A9DB5]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Map will be embedded once the verified company address is confirmed.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};

export default Contact;
