export type WebsiteEnquiryType = 'pcb-project' | 'quote' | 'contact';

export const sendWebsiteEnquiry = async (
  type: WebsiteEnquiryType,
  data: Record<string, unknown>,
): Promise<void> => {
  let response: Response;
  try {
    response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ type, data, website: data.website ?? '' }),
    });
  } catch {
    throw new Error('We could not reach the enquiry service. Check your connection and retry.');
  }

  if (!response.ok) {
    if (response.status === 429) throw new Error('Too many enquiries were sent. Please wait before retrying.');
    if (response.status === 503) throw new Error('Email delivery is not configured yet. Please use the contact email below.');
    throw new Error('Your enquiry could not be delivered. Please try again or use the contact email below.');
  }
};
