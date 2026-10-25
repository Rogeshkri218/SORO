import { useState, type FormEvent } from 'react';
import { apiRequest } from '@/lib/api';
import './OrderStatus.css';

interface CustomerSubmission {
  reference: string;
  serviceType: string;
  status: string;
  project: {
    projectTitle?: string;
    projectType?: string;
    description: string;
    deadline?: string;
  };
  files: Array<{
    originalName: string;
    size: number;
    status: string;
    scanStatus: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const OrderStatus = () => {
  const [reference, setReference] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [submission, setSubmission] = useState<CustomerSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    setSubmission(null);
    try {
      const result = await apiRequest<{ submission: CustomerSubmission }>(
        `/orders/${encodeURIComponent(reference.trim())}`,
        {
          headers: { 'X-Submission-Token': accessCode.trim() },
        },
      );
      setSubmission(result.submission);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not retrieve the enquiry status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="soro-order-status">
      <section className="order-status-card" aria-labelledby="order-status-heading">
        <p className="order-status-kicker">Customer portal</p>
        <h1 id="order-status-heading">Check your enquiry status</h1>
        <p>Enter the reference and private access code provided after submission or in your confirmation email.</p>
        <form onSubmit={(event) => { void checkStatus(event); }}>
          <label htmlFor="order-reference">Enquiry reference</label>
          <input
            autoComplete="off"
            id="order-reference"
            onChange={(event) => setReference(event.target.value)}
            placeholder="SR-YYYYMMDD-XXXXXXXX"
            required
            value={reference}
          />
          <label htmlFor="order-access-code">Private access code</label>
          <input
            autoComplete="off"
            id="order-access-code"
            onChange={(event) => setAccessCode(event.target.value)}
            required
            type="password"
            value={accessCode}
          />
          {error && <p className="order-status-error" role="alert">{error}</p>}
          <button disabled={loading} type="submit">{loading ? 'Checking…' : 'Check status'}</button>
        </form>
      </section>

      {submission && (
        <section className="order-status-result" aria-live="polite">
          <p className="order-status-kicker">{submission.reference}</p>
          <h2>{submission.project.projectTitle || submission.serviceType}</h2>
          <p><strong>Current status:</strong> {submission.status}</p>
          <p><strong>Received:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
          {submission.project.deadline && <p><strong>Requested deadline:</strong> {new Date(submission.project.deadline).toLocaleDateString()}</p>}
          {submission.files.length > 0 && (
            <div>
              <h3>Project files</h3>
              <ul>
                {submission.files.map((file, index) => (
                  <li key={`${file.originalName}-${index}`}>
                    {file.originalName} — {file.status === 'uploaded' ? `uploaded; safety review ${file.scanStatus}` : file.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="order-status-private">Keep your access code private. Contact orders@sorofabrication.in and quote your enquiry reference if you need assistance.</p>
        </section>
      )}
    </main>
  );
};

export default OrderStatus;
