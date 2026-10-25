# SORO Fabrications Private Limited — Official Website

A responsive engineering and product-development website built with React, Vite, TypeScript, and Tailwind CSS.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ⚙️ Environment Configuration

1. Copy `.env.example` to `.env` for local development.
2. Configure the server-only `RESEND_API_KEY` and `ENQUIRY_FROM_EMAIL` values in the local environment and hosting provider's server environment. Do not prefix either value with `VITE_`.
3. Set `ENQUIRY_ALLOWED_ORIGINS` to the exact local and production website origins, separated by commas. Do not include a path or trailing slash.
4. Restart the development server after changing environment variables.

The quote, contact, and PCB project forms submit to the same-origin `/api/enquiry` endpoint. It validates input, checks the request origin, uses a honeypot and request-size limits, and applies a best-effort per-process rate limit before asking Resend to send plain-text email to the fixed recipient `orders@sorofabrication.in`. The customer's validated email is set only as `reply_to`; the sender is the server-configured address. A form reports success only after Resend accepts the request. Provider acceptance does not guarantee delivery to the recipient's inbox.

### Email provider and mailbox setup

This project uses Resend's server-side email API. No Resend credentials, verified sender, or active provider setup are configured in the repository or local environment. Forms will show a not-configured error until the setup below is completed.

Create a Resend account, generate a server API key, and verify a sender domain/address that you control. Configure:

- `RESEND_API_KEY` — private server-side Resend API key.
- `ENQUIRY_FROM_EMAIL` — an address on a domain verified in Resend; never use a customer's address as the sender.
- `ENQUIRY_ALLOWED_ORIGINS` — exact origins of the deployed website and any permitted local development site.

Add only the DNS records Resend provides for domain verification and email authentication (such as SPF/DKIM and any DMARC guidance). Do not guess DNS values. Separately confirm with the email host that `orders@sorofabrication.in` is an active mailbox or distribution address and that its domain's mail routing is configured. Website configuration alone cannot confirm that this mailbox exists or receives mail.

Vercel is the recommended deployment target because it serves `api/enquiry.ts` as a serverless endpoint. Configure the server-side variables in Vercel project settings for each needed environment. Vite also mounts the endpoint locally for development. Static-only hosting does not provide this API route without deploying an equivalent server function; the forms will not deliver email on an unconfigured static host.

The endpoint's in-memory rate limit is a baseline and is not shared between serverless instances. Configure a platform-level firewall/rate limit or shared rate-limit service before relying on it for production abuse protection.

### PCB project file handling

The PCB form sends selected file names and sizes as enquiry metadata only. File contents are not uploaded, stored, or attached to email. Do not select confidential designs; agree on a secure transfer method with SORO before sharing sensitive project files. Secure uploads require a separate private object-storage integration and server-side file scanning/validation.

---

## 📁 Project Structure

```
SORO/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── layout/     ← Navbar, Footer, Layout
│   │   ├── ui/         ← ScrollReveal
│   │   ├── shared/     ← ServiceCard, ProjectCard
│   │   └── 3d/         ← HeroScene (Three.js)
│   ├── data/
│   │   ├── services.ts      ← Edit service details here
│   │   ├── projects.ts      ← Add/edit portfolio projects
│   │   ├── industries.ts    ← Edit industry descriptions
│   │   └── testimonials.ts  ← Add real testimonials
│   ├── pages/          ← All 11 pages
│   ├── router/         ← React Router v6 config
│   ├── types/          ← TypeScript interfaces
│   └── main.tsx
├── .env.example
├── index.html
└── vite.config.ts
```

---

## 📝 Content Required Before Launch

| Item | Status |
|---|---|
| Company email mailbox verification | Needs confirmation |
| Business phone, WhatsApp, and address | Not supplied |
| Official logo and SF favicon artwork | Not present in workspace |
| Verified project records and approved photography | Not supplied |
| Team, certification, and testimonial details | Not supplied |
| Published resource documents | In preparation |
| Production domain | Confirm before updating sitemap and Vercel |

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npx vercel deploy
# For a production deployment after linking the project:
npx vercel --prod
```
Set environment variables in Vercel → Settings → Environment Variables.

### Netlify
Add `public/_redirects` with `/* /index.html 200` for SPA routing, and separately deploy the enquiry handler as a compatible serverless function with the same private environment variables. Without that function, email submissions are unavailable.

### Manual (any static host)
```bash
npm run build
# Upload dist/ to your server
```
Configure server to serve `index.html` for all routes (SPA routing).
The server must also expose a compatible `/api/enquiry` handler; static files alone cannot deliver enquiries.

---

## 🔒 Security

- Never commit `.env` to git (already in `.gitignore`)
- Keep `RESEND_API_KEY` and email-provider configuration in server-only environment variables; never expose them through Vite client variables.
- Do not add phone, address, or WhatsApp details until verified
- Confirm the recipient mailbox and provider DNS settings before production use
- Configure a hosting-provider firewall or shared rate-limit service for production abuse protection
- File attachments require separately configured secure storage and are not currently uploaded

---

## 📦 Tech Stack

React 19 · Vite 8 · TypeScript 6 · Tailwind CSS 4 · React Router 7 · Framer Motion · React Three Fiber / Three.js · React Hook Form · Zod · Lucide React · Resend API (server-side) · React Helmet Async
