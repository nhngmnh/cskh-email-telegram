import nodemailer from 'nodemailer';
import { emailAccounts } from '../config/emailAccounts.js';

export function createTransporter(email) {
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

export async function sendEmail(emailFrom, to, subject, html) {
  const transporter = createTransporter(emailFrom);

  const mailOptions = {
    from: emailFrom,
    to,
    subject,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Email sent from ${emailFrom}:`, info.messageId);
    return info;
  } catch (err) {
    console.error(`[SMTP] Error sending email from ${emailFrom}:`, err.message);
    throw err;
  }
}
