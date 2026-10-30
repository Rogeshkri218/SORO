# SORO Fabrications Private Limited — Website and Enquiry API

SORO's customer website is a React, Vite, and TypeScript single-page application. Enquiry submissions are handled by an Express API, stored in MongoDB Atlas, and may upload project files to a private Supabase Storage bucket. Administrator sessions and order-management endpoints are served by the same API.

## Local development

Install packages and create a local environment file:

```powershell
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Set `MONGODB_URI` in the ignored `.env` file to your Atlas connection string and keep `MONGODB_DB_NAME=soro`; do not commit `.env` or put the URI in a `VITE_*` variable. The local `.env` includes the localhost CORS origins and API defaults. Existing administrator endpoints additionally require independently generated `JWT_SECRET` and `CUSTOMER_TOKEN_SECRET` values and an `ADMIN_EMAIL`; do not use placeholder secrets. For server email and file storage, configure SMTP and Supabase values as described below.

Run the API and website in separate terminals:

```powershell
npm start
```

```powershell
npm run dev
```

The Vite development server proxies `/api` to `http://localhost:5000` by default. Set `VITE_API_PROXY_TARGET` if the local API listens elsewhere. The API listens on `PORT` (default `5000`) and reports `503` at `/api/health` until MongoDB is connected. It retries a failed initial connection; submissions are unavailable until the database is ready.

### Direct submission endpoints

The API also exposes standalone endpoints that write to their matching MongoDB collections:

- `POST /api/enquiries` stores `{ name, email, phone?, company?, subject, message, website? }` in `enquiries`.
- `POST /api/pcb-submissions` stores the PCB project requirements and contact details in `pcb_submissions`. Its accepted JSON fields are `projectType`, `software`, `softwareOther`, `description`, `quantity`, `deliverables`, `constraints`, `deadline`, `contactMethod`, `contact`, `website`, and `specifications`.

Both endpoints require a JSON request from an allowed `CLIENT_ORIGIN`, apply backend validation and the public API rate limit, and return `201` on success or a structured error response. PCB submissions accept requirements only; file metadata or file contents are not accepted by these endpoints, and no upload is claimed. The existing website continues using `POST /api/submissions` and its current storage, admin, and order-status behavior.

The values below are illustrative placeholders, not actual enquiries. Replace them before manually testing a POST; do not use example data as a real customer submission.

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/api/health
```

```powershell
$body = @{
  name = "Replace with a name"
  email = "replace-me@example.invalid"
  subject = "Replace with a subject"
  message = "Replace with a message that is at least 20 characters."
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/enquiries `
  -ContentType "application/json" -Headers @{ Origin = "http://localhost:5173" } -Body $body
```

Build and lint the frontend, and run backend route checks:

```powershell
npm run build
npm run lint
npm run test:server
```

## Architecture and deployment

- **Frontend:** deploy the repository's Vite app to Vercel with `npm run build` and output directory `dist`.
- **API:** deploy the repository as a Node web service to Render, using `npm install` for build and `npm start` for start. Set the health-check path to `/api/health`.
- **Database:** use MongoDB Atlas as the authoritative store for submissions, admin accounts, notification outcomes, and audit records.
- **Project files:** use a private Supabase Storage bucket. The API's service-role key is server-only; the browser receives narrow, short-lived signed-upload tokens.
- **Email:** the Express API sends SMTP mail only after the submission is persisted.

Set `VITE_API_BASE_URL` in the Vercel build environment to the API origin, with no `/api` suffix, for example `https://api.example.com`. Set `CLIENT_ORIGIN` on Render to the exact frontend origin(s), comma-separated and without paths. Include the Vercel preview origin only if previews should access the production API. Keep `VITE_API_BASE_URL` blank for same-origin local development.

For administrator cookies, prefer a same-site custom API hostname under the same registered domain as the website (for example, a site host and an `api` subdomain). Configure the DNS target exactly as supplied by the hosting providers; do not guess DNS records. If using unrelated `vercel.app` and `onrender.com` origins, API CORS is configured for credentials and cookies use `SameSite=None; Secure`, but browsers that block third-party cookies may prevent persistent admin sessions. A same-site custom hostname or a same-origin API proxy is recommended for production admin use.

### Render environment

Configure these server-only variables in Render's service settings. Never expose them as `VITE_*` values:

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Set to `production`. |
| `PORT` | Supplied by Render; the service defaults to `5000` locally. |
| `CLIENT_ORIGIN` | Exact allowed website origins, separated by commas, with no paths. |
| `MONGODB_URI` | Atlas connection string for a database user with only the required database permissions. |
| `MONGODB_DB_NAME` | Database name, for example `soro`. |
| `JWT_SECRET` | At least 32 random characters for administrator sessions. |
| `CUSTOMER_TOKEN_SECRET` | A different, independent secret (at least 32 characters) used to derive customer access codes. |
| `ADMIN_EMAIL` | Initial administrator email used by the one-time provisioning script. |
| `SUPABASE_URL` | Supabase project URL used by the API. |
| `SUPABASE_SERVICE_ROLE_KEY` | Private server-side key; never use it in the frontend. |
| `SUPABASE_STORAGE_BUCKET` | Name of the private bucket, default `soro-project-files`. |
| `MAX_UPLOAD_FILE_BYTES` | Per-file API upload limit; default `104857600` (100 MiB). |
| `MAX_UPLOAD_TOTAL_BYTES` | Total per-submission upload limit; default `524288000` (500 MiB). |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP server credentials. |
| `SMTP_FROM_EMAIL` | Sender address authorized by the SMTP provider. |
| `ENQUIRY_RECIPIENT_VERIFIED` | Set to `true` only after confirming that `orders@sorofabrication.in` can receive mail; otherwise admin notification sending remains disabled. |
| `TRUST_PROXY_HOPS` | Number of trusted reverse-proxy hops; Render's typical default is `1`. |
| `PUBLIC_API_RATE_LIMIT` | Per-process public request limit per 15-minute window; default `30`. |

On Vercel, the browser-facing public values are `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_STORAGE_BUCKET`. The Supabase publishable key is intended for public use; it is not a service-role credential.

## MongoDB Atlas setup

1. Create a dedicated Atlas database and a database user with read/write access only to that database.
2. Configure Atlas network access to allow the Render service's documented outbound IP addresses or a private network connection. Avoid opening database access to every IP address.
3. Put the Atlas URI and database name in Render's server environment. Keep credentials out of source control, logs, and frontend variables.
4. Before opening the API to production traffic, run `npm run db:indexes` from a trusted environment with Atlas access. It creates/verifies model indexes without deleting unrelated indexes. Provision a database user allowed to create indexes for this step, then use a restricted application user for runtime if your Atlas access policy supports separate credentials.

## Supabase private file storage

1. Create a **private** bucket named `soro-project-files` (or use the same custom name in both `SUPABASE_STORAGE_BUCKET` and `VITE_SUPABASE_STORAGE_BUCKET`).
2. Set bucket-level file size and MIME restrictions to match the application's configured limits and allowed extensions. Configure the bucket for private access; do not create public read policies.
3. Add the Supabase project URL and publishable key to Vercel as public `VITE_*` values. Put the service-role key only in Render's server environment.
4. Configure Supabase Storage CORS to allow the deployed website origins and the required upload method/headers. Use the provider's current dashboard documentation rather than guessing CORS settings.
5. The application checks extension, declared MIME type, and declared size and confirms the uploaded object and its size. **It does not perform content inspection, automatic antivirus, or magic-byte scanning.** The admin interface cannot mark files clean, and the API refuses all administrator downloads, including files with a legacy `clean` marker. The only available admin file action is rejection; it does not make a file safe or accessible. Keep the download gate closed until content inspection and malware scanning are genuinely implemented and configured.

Uploads are private and are not attached to enquiry emails. The notification includes filenames, sizes, and upload state only; it does not claim that files were emailed. The public PCB form currently permits up to 50 files, 100 MiB per file, and 500 MiB total. Align Supabase's bucket limits with the backend configuration.

## SMTP, mailbox, and recipient setup

After the recipient mailbox is confirmed, the server can send administrator notifications to `orders@sorofabrication.in`; until then, the server must leave `ENQUIRY_RECIPIENT_VERIFIED=false` and will not attempt administrator notification delivery. Customers' validated addresses are used as `Reply-To`, not as the sender. Customer receipt and status messages use `SMTP_FROM_EMAIL`; it must be accepted by the configured SMTP service. A managed transactional provider such as Resend's SMTP service is a suitable option, as is another SMTP provider that supports authenticated sending from a verified domain.

No mailbox, SMTP account, credentials, or DNS configuration are verified by this repository. Before production use:

1. Confirm that `orders@sorofabrication.in` is an active mailbox or distribution address and that its mail host is configured to receive mail. Only after this check, set `ENQUIRY_RECIPIENT_VERIFIED=true` in the backend environment.
2. Choose an SMTP provider, verify an authorized sender address/domain, and set the provider-issued host, port, username, password, and sender in Render.
3. Add only the SPF, DKIM, DMARC, or verification DNS records supplied by the provider. Do not invent records.
4. Submit a controlled enquiry and verify the provider's acceptance and actual mailbox delivery. The UI records notification delivery attempts; SMTP acceptance alone does not guarantee inbox delivery.

If SMTP is not configured or delivery fails, the database submission remains saved with a notification failure state. The site does not show a false email-success result, and an administrator can retry failed notifications from the order details. No live email delivery can be claimed until real provider configuration is added and tested.

## Administrator setup and use

Create the first admin account from a trusted local shell with the configured Atlas URI and a temporary password of at least 14 characters. Put `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` in the ignored local `.env` file for this one-time command (or securely inject them into the process environment), then run:

```powershell
npm run admin:create
```

The script provisions or rotates the administrator account using bcrypt. Remove the temporary password from `.env` and rotate it after use. Never use the placeholder password in production and never provision an admin from a public endpoint.

The admin site is available at `/admin`. It supports session login/logout, dashboard counts, paginated and searchable enquiry lists, status and internal-note updates, notification status display and retrying failed emails, and rejection of uploaded files. Notification outcomes are also available through the authenticated API. Admin mutations require an HttpOnly session cookie and CSRF token. File downloads remain disabled until an actual safety-inspection and malware-scanning workflow is implemented and configured. Audit events are stored in MongoDB.

Customer references and private access codes are returned after an enquiry has been persisted. The customer can use them at `/order-status`; confirmation email also includes the access code when SMTP is working. Treat that code as a bearer credential and do not share it publicly.

## API overview

All endpoints are under `/api`:

| Method and path | Purpose |
|---|---|
| `GET /health` | Readiness check; responds `200` only when MongoDB is connected. |
| `POST /submissions` | Validates and stores `pcb-project`, `quote`, or `contact` submissions; notification state is returned. |
| `GET /orders/:reference` | Customer-authorized order status; requires `X-Submission-Token`. |
| `POST /submissions/:reference/uploads/sign` | Creates upload tokens for validated project files; requires customer token. |
| `POST /submissions/:reference/uploads/:fileId/complete` | Verifies a stored upload; requires customer token. |
| `POST /admin/login`, `GET /admin/session`, `POST /admin/logout` | Administrator session lifecycle. |
| `GET /admin/dashboard`, `GET /admin/orders` | Summary and paginated/filterable enquiry list. |
| `GET /admin/orders/:id`, `PATCH /admin/orders/:id/status` | View/update an enquiry. |
| `POST /admin/orders/:id/notifications/retry`, `GET /admin/notifications` | Retry failed notifications and review notification outcomes. |
| `PATCH /admin/orders/:id/files/:fileId/scan` | Reject an uploaded file; marking a file clean is not supported. |
| `GET /admin/orders/:id/files/:fileId` | Returns `423` while the file-safety workflow is not implemented. |

Public endpoints validate fields with Zod, require an allowed origin for submissions and login, use honeypot fields and per-process rate limiting, and cap JSON request size. Rate limiting is not shared across Render instances; add a shared limiter or provider-level protection before scaling or relying on it as the only abuse control.

## Environment and Git safety

- `.env` and `.env.*` are Git-ignored; `.env.example` contains placeholders only.
- Never prefix private credentials with `VITE_`, log credentials, or put them in source control.
- Rotate secrets immediately if they are exposed.
- The repository does not include production credentials, an Atlas connection, an active Supabase storage configuration, SMTP settings, or deployment-specific hostnames.

## Project structure

```text
src/                 React website, forms, admin UI, order status page
server/              Express API, MongoDB models, auth, SMTP, storage
public/              Website static assets
vite.config.ts       Vite configuration and local /api proxy
.env.example         Placeholder environment-variable names/values
```
