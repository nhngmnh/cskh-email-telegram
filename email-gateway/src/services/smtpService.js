import nodemailer from 'nodemailer';
import { emailAccounts } from '../config/emailAccounts.js';

// Tạo transporter tương ứng với email cấu hình
function createTransporter(email) {
  const account = emailAccounts[email];
  console.log(typeof(email));
  
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
export async function sendReplyEmail(from, to, subject, rawMessage) {
  const transporter = createTransporter(from);

  // 1. Tách các dòng chứa file đính kèm và nội dung chính
  const lines = rawMessage.split('\n');
  const attachments = [];
  const contentLines = [];

  for (const line of lines) {
    if (line.startsWith('[file]')) {
      const url = line.replace('[file]', '').trim();
      if (url) attachments.push({ path: url });
    } else {
      contentLines.push(line);
    }
  }

  // 2. Chuyển text thành HTML đơn giản (xuống dòng => <br />)
  const html = contentLines.join('\n').replace(/\n/g, '<br />');

  const mailOptions = {
    from,
    to,
    subject,
    html,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Email sent from ${from} to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[SMTP] Failed to send email from ${from} to ${to}:`, err.message);
    throw err;
  }
}
