import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  ArrowRight,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

// ==========================================
// Zod Validation Schema
// ==========================================
const quoteSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  companyName: z.string().optional(),
  email: z.string().email('Please enter a valid business email'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  serviceCategory: z.string().min(1, 'Please select a service category'),
  projectTitle: z.string().min(3, 'Please provide a project title'),
  projectDescription: z.string().min(30, 'Please describe your project in at least 30 characters'),
  estimatedQuantity: z.string().min(1, 'Please specify the quantity'),
  budgetRange: z.string().optional(),
  deliveryDate: z.string().optional(),
  contactMethod: z.string().min(1, 'Please select a preferred contact method'),
  privacyConsent: z.literal(true, {
    error: () => 'You must agree to the privacy policy to submit',
  }),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const serviceCategories = [
  'PCB Design',
  'PCB Assembly',
  'Embedded Systems / Firmware',
  '3D Design (CAD)',
  '3D Printing',
  'CNC Machining',
  'Laser Cutting',
  'Sheet Metal Fabrication',
  'Multiple Services',
  'Other / Not Sure',
];

const budgetRanges = [
  'Under ₹10,000',
  '₹10,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹5,00,000',
  'Above ₹5,00,000',
  'Prefer not to say',
];

const contactMethods = ['Email', 'Phone Call', 'WhatsApp', 'Video Call'];

// ==========================================
// Field Error Component
// ==========================================
const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  ) : null;

// ==========================================
// Quote Page
// ==========================================
const Quote: React.FC = () => {
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormValues) => {
    setSubmitState('loading');

    try {
      const { VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_QUOTE_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY } = import.meta.env;
      if (!VITE_EMAILJS_SERVICE_ID || !VITE_EMAILJS_QUOTE_TEMPLATE_ID || !VITE_EMAILJS_PUBLIC_KEY) {
        throw new Error('Email delivery is not configured.');
      }
      await emailjs.send(
        VITE_EMAILJS_SERVICE_ID,
        VITE_EMAILJS_QUOTE_TEMPLATE_ID,
        { ...data, to_email: 'orders@sorofabrication.in' },
        { publicKey: VITE_EMAILJS_PUBLIC_KEY },
      );

      setSubmitState('success');
      reset();
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Request a Quote — SORO Fabrications Private Limited</title>
        <meta
          name="description"
          content="Request a detailed engineering quotation from SORO Fabrications. Submit your project requirements and receive a response from our engineering team."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-36 pb-16 bg-[#0A1628] overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="container-soro relative z-10">
          <ScrollReveal>
            <div className="badge-blue mb-5 w-fit">Get a Quote</div>
            <h1 className="text-display text-white mb-6 max-w-3xl">
              Request an{' '}
              <span className="gradient-text">Engineering Quotation</span>
            </h1>
            <p
              className="text-[#8A9DB5] text-lg max-w-2xl leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Share your project details and we'll provide a thorough, transparent quotation.
              All enquiries are reviewed by our engineering team.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-[#0D1B2A]">
        <div className="container-soro">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Side Info */}
            <ScrollReveal className="lg:col-span-1">
              <div className="space-y-6">
                <div className="glass p-6 rounded-2xl">
                  <h3
                    className="text-white font-bold mb-4"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    What happens next?
                  </h3>
                  {[
                    'We receive your enquiry and review your requirements.',
                    'Our engineering team evaluates the scope and technical feasibility.',
                    'We follow up to clarify scope and discuss a next step.',
                    'On approval, we proceed with design and engineering.',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-3 mb-4 last:mb-0">
                      <div className="w-6 h-6 rounded-full bg-[#1E6FFF]/20 border border-[#1E6FFF]/40 flex items-center justify-center shrink-0 mt-0.5">
                        <span
                          className="text-[#1E6FFF] text-xs font-bold"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          {i + 1}
                        </span>
                      </div>
                      <p
                        className="text-[#8A9DB5] text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="glass p-6 rounded-2xl">
                  <h3
                    className="text-white font-bold mb-3"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Share project files
                  </h3>
                  <p
                    className="text-[#8A9DB5] text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Attachments are not enabled on this form. Email drawings or reference files to{' '}
                    <a className="text-[#1E6FFF] hover:underline" href="mailto:orders@sorofabrication.in">orders@sorofabrication.in</a>.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={0.15} className="lg:col-span-2">
              {submitState === 'success' ? (
                <div className="glass p-12 rounded-2xl text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2
                    className="text-white font-bold text-2xl mb-3"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Enquiry Submitted!
                  </h2>
                  <p
                    className="text-[#8A9DB5] mb-8"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Your enquiry was delivered successfully. SORO can follow up using the contact
                    details you provided.
                  </p>
                  <button
                    onClick={() => setSubmitState('idle')}
                    className="btn-secondary"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="glass p-8 rounded-2xl space-y-6"
                  noValidate
                >
                  <h2
                    className="text-white font-bold text-xl mb-2"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Project Enquiry Form
                  </h2>
                  <div className="divider-glow" />

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="fullName" className="input-label">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className={`input-field ${errors.fullName ? 'error' : ''}`}
                        placeholder="Your full name"
                        {...register('fullName')}
                      />
                      <FieldError message={errors.fullName?.message} />
                    </div>
                    <div>
                      <label htmlFor="companyName" className="input-label">
                        Company Name
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        className="input-field"
                        placeholder="Your company (optional)"
                        {...register('companyName')}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="input-label">
                        Business Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={`input-field ${errors.email ? 'error' : ''}`}
                        placeholder="you@company.com"
                        {...register('email')}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>
                    <div>
                      <label htmlFor="phone" className="input-label">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className={`input-field ${errors.phone ? 'error' : ''}`}
                        placeholder="+91 9876543210"
                        {...register('phone')}
                      />
                      <FieldError message={errors.phone?.message} />
                    </div>
                  </div>

                  {/* Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="serviceCategory" className="input-label">
                        Service Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="serviceCategory"
                        className={`input-field ${errors.serviceCategory ? 'error' : ''}`}
                        {...register('serviceCategory')}
                        defaultValue=""
                      >
                        <option value="" disabled>Select a service…</option>
                        {serviceCategories.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <FieldError message={errors.serviceCategory?.message} />
                    </div>
                    <div>
                      <label htmlFor="estimatedQuantity" className="input-label">
                        Estimated Quantity <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="estimatedQuantity"
                        type="text"
                        className={`input-field ${errors.estimatedQuantity ? 'error' : ''}`}
                        placeholder="e.g. 1 prototype, 10 units"
                        {...register('estimatedQuantity')}
                      />
                      <FieldError message={errors.estimatedQuantity?.message} />
                    </div>
                  </div>

                  {/* Project */}
                  <div>
                    <label htmlFor="projectTitle" className="input-label">
                      Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="projectTitle"
                      type="text"
                      className={`input-field ${errors.projectTitle ? 'error' : ''}`}
                      placeholder="Brief project name"
                      {...register('projectTitle')}
                    />
                    <FieldError message={errors.projectTitle?.message} />
                  </div>

                  <div>
                    <label htmlFor="projectDescription" className="input-label">
                      Project Description & Requirements <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="projectDescription"
                      rows={5}
                      className={`input-field resize-none ${errors.projectDescription ? 'error' : ''}`}
                      placeholder="Describe your project, technical requirements, materials, specifications, and any design constraints…"
                      {...register('projectDescription')}
                    />
                    <FieldError message={errors.projectDescription?.message} />
                  </div>

                  {/* Budget & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="budgetRange" className="input-label">
                        Budget Range (optional)
                      </label>
                      <select
                        id="budgetRange"
                        className="input-field"
                        {...register('budgetRange')}
                        defaultValue=""
                      >
                        <option value="">Select budget range…</option>
                        {budgetRanges.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="deliveryDate" className="input-label">
                        Required by (optional)
                      </label>
                      <input
                        id="deliveryDate"
                        type="date"
                        className="input-field"
                        {...register('deliveryDate')}
                      />
                    </div>
                  </div>

                  {/* Contact Method */}
                  <div>
                    <label htmlFor="contactMethod" className="input-label">
                      Preferred Contact Method <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="contactMethod"
                      className={`input-field ${errors.contactMethod ? 'error' : ''}`}
                      {...register('contactMethod')}
                      defaultValue=""
                    >
                      <option value="" disabled>Select contact method…</option>
                      {contactMethods.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <FieldError message={errors.contactMethod?.message} />
                  </div>

                  <p className="text-[#8A9DB5] text-sm">
                    Need to share drawings or reference files? Email them to{' '}
                    <a className="text-[#1E6FFF] hover:underline" href="mailto:orders@sorofabrication.in">
                      orders@sorofabrication.in
                    </a>{' '}
                    after submitting your enquiry. File attachments are not enabled on this form.
                  </p>

                  {/* Privacy Consent */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 rounded border border-[#1E3050] bg-[#0D1B2A] accent-[#1E6FFF]"
                        {...register('privacyConsent')}
                      />
                      <span
                        className="text-[#8A9DB5] text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        I consent to SORO Fabrications contacting me regarding this enquiry.{' '}
                        <span className="text-red-400">*</span>
                      </span>
                    </label>
                    <FieldError message={errors.privacyConsent?.message} />
                  </div>

                  {/* Submit */}
                  {submitState === 'error' && (
                    <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Delivery failed or is not configured. Please try again or email{' '}
                      <a className="underline" href="mailto:orders@sorofabrication.in">orders@sorofabrication.in</a>.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full justify-center py-3"
                    disabled={submitState === 'loading'}
                    id="submitQuoteButton"
                  >
                    {submitState === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Enquiry…
                      </>
                    ) : (
                      <>
                        Submit Enquiry
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[#8A9DB5]/70 text-xs text-center">
                    If submission is unavailable, email us at{' '}
                    <a href="mailto:orders@sorofabrication.in" className="text-[#1E6FFF] hover:underline">
                      orders@sorofabrication.in
                    </a>.
                  </p>

                  <div className="flex gap-2 items-center justify-center pt-2">
                    <ArrowRight className="w-3.5 h-3.5 text-[#8A9DB5]" />
                    <span
                      className="text-[#8A9DB5] text-xs"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Your enquiry is sent only after the configured email service confirms delivery.
                    </span>
                  </div>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};

export default Quote;
