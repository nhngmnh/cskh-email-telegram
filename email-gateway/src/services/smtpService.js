import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Tạo kết nối tới SMTP server (ví dụ: Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // ví dụ: smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT), // ví dụ: 465 (SSL) hoặc 587 (TLS)
  secure: process.env.SMTP_SECURE === 'true', // true nếu dùng SSL (port 465)
  auth: {
    user: process.env.SMTP_USER,     // Email dùng để gửi
    pass: process.env.SMTP_PASS      // Mật khẩu ứng dụng (App Password nếu dùng Gmail)
  }
});

export async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.SMTP_USER, // email người gửi
    to: to,
    subject: subject,
    html: html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[SMTP] Email đã được gửi:', info.messageId);
    return info;
  } catch (err) {
    console.error('[SMTP] Lỗi khi gửi email:', err.message);
    throw err;
  }
}
