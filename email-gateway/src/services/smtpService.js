import nodemailer from 'nodemailer';
import { emailAccounts } from '../config/emailAccounts.js';

// Tạo transporter tương ứng với email cấu hình
function createTransporter(email) {
  const account = emailAccounts[email];
  if (!account) throw new Error(`No SMTP config for email: ${email}`);

  return nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: email,
      pass: account.appPassword
    }
  });
}

// Gửi email dạng reply (có inReplyTo & references)
export async function sendReplyEmail(from, to, subject, html, inReplyToMessageId) {
  const transporter = createTransporter(from);

  const mailOptions = {
    from,
    to,
    subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
    html,
    inReplyTo: inReplyToMessageId,
    references: inReplyToMessageId
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Reply email sent from ${from} to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[SMTP] Failed to send reply from ${from} to ${to}:`, err.message);
    throw err;
  }
}
