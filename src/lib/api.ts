export type WebsiteEnquiryType = 'pcb-project' | 'quote' | 'contact';

export interface SubmissionResponse {
  success: true;
  submission: {
    id: string;
    reference: string;
    serviceType: string;
    status: string;
    emailNotifications: {
      admin: 'pending' | 'sent' | 'failed';
      customer: 'pending' | 'sent' | 'failed';
    };
    createdAt: string;
  };
  accessToken: string;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

export const apiUrl = (path: string) => `${apiBaseUrl}/api${path.startsWith('/') ? path : `/${path}`}`;

export const apiRequest = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('We could not reach the SORO service. Check your connection and retry.');
  }

  const payload = await response.json().catch(() => null) as { error?: string; details?: Array<{ field: string; message: string }> } | null;
  if (!response.ok) {
    const fieldMessage = payload?.details?.map((item) => item.message).join(' ');
    throw new Error(fieldMessage || payload?.error || 'Your request could not be completed. Please retry.');
  }
  return payload as T;
};

export const sendWebsiteEnquiry = async (
  type: WebsiteEnquiryType,
  data: Record<string, unknown>,
  requestId: string,
): Promise<SubmissionResponse> => apiRequest<SubmissionResponse>('/submissions', {
  method: 'POST',
  headers: { 'Idempotency-Key': requestId },
  body: JSON.stringify({ type, requestId, data }),
});
