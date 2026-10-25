import { useEffect, useState, type FormEvent } from 'react';
import { apiRequest } from '@/lib/api';
import './Admin.css';

type OrderStatus = 'Pending Review' | 'Quoted' | 'In Production' | 'Completed' | 'Cancelled';

interface AdminUser {
  email: string;
  role: 'admin';
}

interface ProjectFile {
  _id: string;
  originalName: string;
  size: number;
  contentType: string;
  status: 'pending' | 'uploaded' | 'rejected';
  scanStatus: 'pending' | 'clean' | 'rejected';
}

interface Submission {
  _id: string;
  reference: string;
  serviceType: string;
  status: OrderStatus;
  customer: { name: string; email: string; phone?: string; company?: string };
  project: {
    projectTitle?: string;
    projectType?: string;
    software?: string;
    description: string;
    quantity?: string;
    deliverables?: string[];
    constraints?: string;
    deadline?: string;
    specifications?: Record<string, unknown>;
  };
  files: ProjectFile[];
  adminNotes?: string;
  quotedAmount?: number;
  paymentStatus?: 'Not Applicable' | 'Unpaid' | 'Paid' | 'Refunded';
  emailNotifications?: { admin: string; customer: string };
  createdAt: string;
}

interface AdminSession {
  admin: AdminUser;
  csrfToken: string;
}

interface OrdersResponse {
  items: Submission[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

interface DashboardResponse {
  statistics: Record<string, number>;
}

const statuses: OrderStatus[] = ['Pending Review', 'Quoted', 'In Production', 'Completed', 'Cancelled'];

const formatBytes = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Admin = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<OrdersResponse>({ items: [], pagination: { page: 1, limit: 25, total: 0, pages: 0 } });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Submission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [quotedAmount, setQuotedAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<NonNullable<Submission['paymentStatus']>>('Not Applicable');
  const [reviewNote, setReviewNote] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest<AdminSession>('/admin/session')
      .then((session) => {
        if (!active) return;
        setAdmin(session.admin);
        setCsrfToken(session.csrfToken);
      })
      .catch((requestError) => {
        if (!active) return;
        setAdmin(null);
        if (requestError instanceof Error && !requestError.message.includes('Administrator authentication is required.')) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!admin) return;
    apiRequest<DashboardResponse>('/admin/dashboard')
      .then((result) => setStatistics(result.statistics))
      .catch((requestError: Error) => setError(requestError.message));
  }, [admin]);

  useEffect(() => {
    if (!admin) return;
    const query = new URLSearchParams({ page: String(page), limit: '25' });
    if (search) query.set('search', search);
    if (statusFilter) query.set('status', statusFilter);
    let active = true;
    apiRequest<OrdersResponse>(`/admin/orders?${query.toString()}`)
      .then((result) => {
        if (active) setOrders(result);
      })
      .catch((requestError: Error) => {
        if (active) setError(requestError.message);
      });
    return () => { active = false; };
  }, [admin, page, search, statusFilter]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const session = await apiRequest<AdminSession>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAdmin(session.admin);
      setCsrfToken(session.csrfToken);
      setPassword('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    setBusy(true);
    setError('');
    try {
      await apiRequest('/admin/logout', {
        method: 'POST',
        headers: { 'X-CSRF-Token': csrfToken },
      });
      setAdmin(null);
      setCsrfToken('');
      setSelectedOrder(null);
      setStatistics({});
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Sign-out failed.');
    } finally {
      setBusy(false);
    }
  };

  const openOrder = async (order: Submission) => {
    setSelectedOrder(order);
    setAdminNotes(order.adminNotes ?? '');
    setQuotedAmount(order.quotedAmount === undefined ? '' : String(order.quotedAmount));
    setPaymentStatus(order.paymentStatus ?? 'Not Applicable');
    setReviewNote('');
    try {
      const result = await apiRequest<{ submission: Submission }>(`/admin/orders/${encodeURIComponent(order._id)}`);
      setSelectedOrder(result.submission);
      setAdminNotes(result.submission.adminNotes ?? '');
      setQuotedAmount(result.submission.quotedAmount === undefined ? '' : String(result.submission.quotedAmount));
      setPaymentStatus(result.submission.paymentStatus ?? 'Not Applicable');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not load this enquiry.');
    }
  };

  const updateOrder = async (status: OrderStatus) => {
    if (!selectedOrder || busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await apiRequest<{ submission: Submission }>(`/admin/orders/${encodeURIComponent(selectedOrder._id)}/status`, {
        method: 'PATCH',
        headers: { 'X-CSRF-Token': csrfToken },
        body: JSON.stringify({
          status,
          adminNotes,
          quotedAmount: quotedAmount ? Number(quotedAmount) : null,
          paymentStatus,
        }),
      });
      setSelectedOrder(result.submission);
      setOrders((previous) => ({
        ...previous,
        items: previous.items.map((order) => order._id === result.submission._id ? result.submission : order),
      }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not update this enquiry.');
    } finally {
      setBusy(false);
    }
  };

  const reviewFile = async (file: ProjectFile) => {
    if (!selectedOrder || busy || reviewNote.trim().length < 10) {
      setError('Enter a review note of at least 10 characters before recording the file review.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const result = await apiRequest<{ file: { id: string; scanStatus: ProjectFile['scanStatus']; status: ProjectFile['status'] } }>(
        `/admin/orders/${encodeURIComponent(selectedOrder._id)}/files/${encodeURIComponent(file._id)}/scan`,
        {
          method: 'PATCH',
          headers: { 'X-CSRF-Token': csrfToken },
          body: JSON.stringify({ status: 'rejected', reviewNote }),
        },
      );
      setSelectedOrder((previous) => previous ? {
        ...previous,
        files: previous.files.map((item) => item._id === file._id
          ? { ...item, scanStatus: result.file.scanStatus, status: result.file.status }
          : item),
      } : previous);
      setReviewNote('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not record the file review.');
    } finally {
      setBusy(false);
    }
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  if (checkingSession) {
    return <main className="soro-admin"><p role="status">Checking administrator session…</p></main>;
  }

  if (!admin) {
    return (
      <main className="soro-admin">
        <section className="admin-login-card" aria-labelledby="admin-login-title">
          <p className="admin-kicker">Secure workspace</p>
          <h1 id="admin-login-title">Administrator sign in</h1>
          <p>Access to customer enquiries is restricted to authorized SORO administrators.</p>
          <form onSubmit={(event) => { void handleLogin(event); }}>
            <label htmlFor="admin-email">Email</label>
            <input autoComplete="username" id="admin-email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            <label htmlFor="admin-password">Password</label>
            <input autoComplete="current-password" id="admin-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="soro-admin">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">SORO operations</p>
          <h1>Enquiry management</h1>
          <p>Signed in as {admin.email}</p>
        </div>
        <button className="admin-logout" disabled={busy} onClick={() => { void handleLogout(); }} type="button">Sign out</button>
      </header>

      {error && <p className="admin-error" role="alert">{error}</p>}

      <section className="admin-stat-grid" aria-label="Enquiry summary">
        {[
          ['Total enquiries', 'total'],
          ['Pending review', 'pendingReview'],
          ['Quoted', 'quoted'],
          ['In production', 'inProduction'],
          ['Completed', 'completed'],
          ['Cancelled', 'cancelled'],
        ].map(([label, key]) => (
          <article className="admin-stat-card" key={key}>
            <span>{label}</span>
            <strong>{statistics[key] ?? '—'}</strong>
          </article>
        ))}
      </section>

      <div className="admin-workspace">
        <section className="admin-orders-panel" aria-labelledby="admin-orders-title">
          <div className="admin-panel-heading">
            <div>
              <h2 id="admin-orders-title">Customer enquiries</h2>
              <p>{orders.pagination.total} total · page {orders.pagination.page} of {Math.max(orders.pagination.pages, 1)}</p>
            </div>
          </div>
          <form className="admin-filter-form" onSubmit={submitSearch}>
            <label className="admin-search-label" htmlFor="admin-search">Search reference, name, or email</label>
            <div className="admin-filter-controls">
              <input id="admin-search" onChange={(event) => setSearchInput(event.target.value)} value={searchInput} />
              <select aria-label="Filter by status" onChange={(event) => { setPage(1); setStatusFilter(event.target.value); }} value={statusFilter}>
                <option value="">All statuses</option>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button type="submit">Search</button>
            </div>
          </form>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr><th>Reference</th><th>Customer</th><th>Service</th><th>Status</th><th>Received</th></tr>
              </thead>
              <tbody>
                {orders.items.map((order) => (
                  <tr key={order._id}>
                    <td><button className="admin-reference" onClick={() => { void openOrder(order); }} type="button">{order.reference}</button></td>
                    <td>{order.customer.name}<small>{order.customer.email}</small></td>
                    <td>{order.serviceType}</td>
                    <td><span className="admin-status">{order.status}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {!orders.items.length && <tr><td className="admin-empty" colSpan={5}>No enquiries found.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="admin-pagination">
            <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} type="button">Previous</button>
            <span>Page {page}</span>
            <button disabled={page >= orders.pagination.pages} onClick={() => setPage((current) => current + 1)} type="button">Next</button>
          </div>
        </section>

        <aside className="admin-detail-panel" aria-labelledby="admin-detail-title">
          <h2 id="admin-detail-title">Enquiry details</h2>
          {!selectedOrder ? (
            <p className="admin-detail-empty">Select an enquiry to inspect details, update its status, and review uploaded files.</p>
          ) : (
            <div className="admin-order-detail">
              <p className="admin-order-reference">{selectedOrder.reference}</p>
              <h3>{selectedOrder.project.projectTitle || selectedOrder.serviceType}</h3>
              <dl>
                <div><dt>Customer</dt><dd>{selectedOrder.customer.name}</dd></div>
                <div><dt>Email</dt><dd><a href={`mailto:${selectedOrder.customer.email}`}>{selectedOrder.customer.email}</a></dd></div>
                {selectedOrder.customer.phone && <div><dt>Phone</dt><dd>{selectedOrder.customer.phone}</dd></div>}
                {selectedOrder.customer.company && <div><dt>Company</dt><dd>{selectedOrder.customer.company}</dd></div>}
                <div><dt>Project type</dt><dd>{selectedOrder.project.projectType || selectedOrder.serviceType}</dd></div>
                {selectedOrder.project.software && <div><dt>Software</dt><dd>{selectedOrder.project.software}</dd></div>}
                {selectedOrder.project.quantity && <div><dt>Quantity</dt><dd>{selectedOrder.project.quantity}</dd></div>}
                {selectedOrder.project.deadline && <div><dt>Deadline</dt><dd>{new Date(selectedOrder.project.deadline).toLocaleDateString()}</dd></div>}
                {selectedOrder.project.deliverables?.length ? <div><dt>Deliverables</dt><dd>{selectedOrder.project.deliverables.join(', ')}</dd></div> : null}
                {Object.entries(selectedOrder.project.specifications ?? {}).some(([key, value]) => key !== 'selectedFiles' && typeof value === 'string' && value.trim())
                  && (
                    <div>
                      <dt>Specifications</dt>
                      <dd>
                        {Object.entries(selectedOrder.project.specifications ?? {})
                          .filter(([key, value]) => key !== 'selectedFiles' && typeof value === 'string' && value.trim())
                          .map(([key, value]) => `${key}: ${String(value)}`).join('; ')}
                      </dd>
                    </div>
                  )}
                <div className="admin-description"><dt>Project description</dt><dd>{selectedOrder.project.description}</dd></div>
                {selectedOrder.project.constraints && <div className="admin-description"><dt>Additional requirements</dt><dd>{selectedOrder.project.constraints}</dd></div>}
              </dl>
              <label htmlFor="admin-notes">Internal notes</label>
              <textarea id="admin-notes" maxLength={10_000} onChange={(event) => setAdminNotes(event.target.value)} value={adminNotes} />
              <p className="admin-notification-status">
                Email notifications — SORO: {selectedOrder.emailNotifications?.admin ?? 'unknown'} · Customer: {selectedOrder.emailNotifications?.customer ?? 'unknown'}
              </p>
              <label htmlFor="admin-status">Order status</label>
              <select id="admin-status" onChange={(event) => { void updateOrder(event.target.value as OrderStatus); }} value={selectedOrder.status}>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <label htmlFor="admin-quoted-amount">Quoted amount</label>
              <input
                id="admin-quoted-amount"
                min="0"
                onChange={(event) => setQuotedAmount(event.target.value)}
                step="0.01"
                type="number"
                value={quotedAmount}
              />
              <label htmlFor="admin-payment-status">Payment status</label>
              <select id="admin-payment-status" onChange={(event) => setPaymentStatus(event.target.value as NonNullable<Submission['paymentStatus']>)} value={paymentStatus}>
                {['Not Applicable', 'Unpaid', 'Paid', 'Refunded'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button
                className="admin-save-notes"
                disabled={busy || (
                  adminNotes === (selectedOrder.adminNotes ?? '')
                  && quotedAmount === (selectedOrder.quotedAmount === undefined ? '' : String(selectedOrder.quotedAmount))
                  && paymentStatus === (selectedOrder.paymentStatus ?? 'Not Applicable')
                )}
                onClick={() => { void updateOrder(selectedOrder.status); }}
                type="button"
              >
                Save order details
              </button>

              <section className="admin-files" aria-labelledby="admin-files-title">
                <h3 id="admin-files-title">Project files ({selectedOrder.files.length})</h3>
                <p role="note">Automated content inspection and malware scanning are not configured. File downloads remain disabled; files cannot be marked clean here.</p>
                {selectedOrder.files.length === 0 && <p>No files uploaded.</p>}
                {selectedOrder.files.map((file) => (
                  <article className="admin-file-card" key={file._id}>
                    <strong>{file.originalName}</strong>
                    <span>{formatBytes(file.size)} · upload: {file.status} · safety review: {file.scanStatus === 'clean' ? 'legacy clean marker (not scanner-verified)' : file.scanStatus}</span>
                    {file.status === 'uploaded' && file.scanStatus === 'pending' && (
                      <div className="admin-file-review">
                        <label htmlFor={`review-note-${file._id}`}>Reason for rejecting this file</label>
                        <textarea id={`review-note-${file._id}`} onChange={(event) => setReviewNote(event.target.value)} value={reviewNote} />
                        <div>
                          <button className="admin-reject" disabled={busy} onClick={() => { void reviewFile(file); }} type="button">Reject file</button>
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </section>
              {(selectedOrder.emailNotifications?.admin === 'failed' || selectedOrder.emailNotifications?.customer === 'failed') && (
                <button
                  className="admin-save-notes"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError('');
                    try {
                      const result = await apiRequest<{ emailNotifications: { admin: string; customer: string } }>(
                        `/admin/orders/${encodeURIComponent(selectedOrder._id)}/notifications/retry`,
                        { method: 'POST', headers: { 'X-CSRF-Token': csrfToken } },
                      );
                      setSelectedOrder((previous) => previous ? { ...previous, emailNotifications: result.emailNotifications } : previous);
                    } catch (requestError) {
                      setError(requestError instanceof Error ? requestError.message : 'Could not retry failed notifications.');
                    } finally {
                      setBusy(false);
                    }
                  }}
                  type="button"
                >
                  Retry failed email notifications
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
};

export default Admin;
