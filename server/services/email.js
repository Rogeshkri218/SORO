import nodemailer from 'nodemailer';
import { NotificationLog } from '../models/NotificationLog.js';

let transport;

const getTransport = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const port = Number(SMTP_PORT);
  if (!SMTP_HOST || !Number.isInteger(port) || port < 1 || port > 65_535 || !SMTP_USER || !SMTP_PASS) return null;
  if (!transport) {
    transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return transport;
};

const sendAndLog = async ({ submission, type, recipient, message }) => {
  const mailTransport = getTransport();
  try {
    if (type === 'admin-new-submission' && process.env.ENQUIRY_RECIPIENT_VERIFIED !== 'true') {
      throw Object.assign(new Error('The enquiry recipient mailbox has not been confirmed.'), { code: 'RECIPIENT_NOT_VERIFIED' });
    }
    if (!process.env.SMTP_FROM_EMAIL) {
      throw Object.assign(new Error('SMTP sender is not configured.'), { code: 'SMTP_NOT_CONFIGURED' });
    }
    if (!mailTransport) throw Object.assign(new Error('SMTP is not configured.'), { code: 'SMTP_NOT_CONFIGURED' });
    message.from = process.env.SMTP_FROM_EMAIL;
    const info = await mailTransport.sendMail(message);
    await NotificationLog.create({
      submission: submission._id,
      type,
      recipient,
      status: 'sent',
      providerMessageId: info.messageId,
    });
    return 'sent';
  } catch (error) {
    try {
      await NotificationLog.create({
        submission: submission._id,
        type,
        recipient,
        status: 'failed',
        errorCode: typeof error?.code === 'string' ? error.code.slice(0, 80) : 'SMTP_SEND_FAILED',
      });
    } catch (logError) {
      console.error('Could not persist email notification failure:', logError instanceof Error ? logError.name : 'unknown error');
    }
    return 'failed';
  }
};

export const sendSubmissionNotifications = async (
  submission,
  { accessToken, admin = true, customer = true } = {},
) => {
  const lines = [
    `Reference: ${submission.reference}`,
    `Status: ${submission.status}`,
    `Customer: ${submission.customer.name}`,
    `Email: ${submission.customer.email}`,
    `Phone: ${submission.customer.phone || 'Not provided'}`,
    `Company: ${submission.customer.company || 'Not provided'}`,
    `Service: ${submission.serviceType}`,
    `Project title: ${submission.project.projectTitle || 'Not provided'}`,
    `Project type: ${submission.project.projectType || 'Not provided'}`,
    `Software: ${submission.project.software || 'Not provided'}`,
    `Preferred contact method: ${submission.project.contactMethod || 'Not provided'}`,
    '',
    'Project details:',
    submission.project.description,
    '',
    `Expected quantity: ${submission.project.quantity || 'Not provided'}`,
    `Budget range: ${submission.project.budget || 'Not provided'}`,
    `Deliverables: ${submission.project.deliverables.join(', ') || 'Not provided'}`,
    `Additional requirements: ${submission.project.constraints || 'Not provided'}`,
    `Requested deadline: ${submission.project.deadline?.toISOString().slice(0, 10) || 'Not provided'}`,
    `PCB manufacturing specifications: ${Object.entries(submission.project.specifications || {})
      .filter(([key, value]) => key !== 'selectedFiles' && typeof value === 'string' && value)
      .map(([key, value]) => `${key}: ${value}`).join('; ') || 'Not provided'}`,
    `Selected files: ${(submission.project.specifications?.selectedFiles ?? [])
      .map((file) => `${file.name} (${file.size} bytes)`).join('; ') || 'None'}`,
    `Uploaded file records (not attached; downloads are disabled until scanning is configured): ${submission.files
      .map((file) => `${file._id} — ${file.originalName} (${file.size} bytes; ${file.status})`).join('; ') || 'None yet'}`,
  ];
  const text = lines.join('\n');
  const subject = `New SORO Website Enquiry – ${submission.serviceType}`;
  const adminRecipient = 'orders@sorofabrication.in';
  const [adminStatus, customerStatus] = await Promise.all([
    admin ? sendAndLog({
      submission,
      type: 'admin-new-submission',
      recipient: adminRecipient,
      message: {
        to: adminRecipient,
        replyTo: submission.customer.email,
        subject,
        text,
      },
    }) : Promise.resolve(submission.emailNotifications.admin),
    customer ? sendAndLog({
      submission,
      type: 'customer-confirmation',
      recipient: submission.customer.email,
      message: {
        to: submission.customer.email,
        subject: `SORO received your enquiry (${submission.reference})`,
        text: `Thank you for contacting SORO Fabrications. Your enquiry was saved with reference ${submission.reference} and is pending review.\n\nUse this private access code on the SORO Order Status page to check progress: ${accessToken || 'Contact SORO if you need status access.'}\n\nKeep this code private and quote the reference in any follow-up.`,
      },
    }) : Promise.resolve(submission.emailNotifications.customer),
  ]);
  if (admin) submission.emailNotifications.admin = adminStatus;
  if (customer) submission.emailNotifications.customer = customerStatus;
  await submission.save();
};

export const sendStatusNotification = async (submission) => {
  await sendAndLog({
    submission,
    type: 'status-update',
    recipient: submission.customer.email,
    message: {
      to: submission.customer.email,
      subject: `SORO project ${submission.reference} status update`,
      text: `Your SORO project enquiry ${submission.reference} status is now: ${submission.status}.`,
    },
  });
};
