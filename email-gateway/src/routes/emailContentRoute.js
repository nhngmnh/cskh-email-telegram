import { getImapClientByEmail } from '../services/imapService.js';
import { simpleParser } from 'mailparser';
import express from 'express';
import { emailAccounts } from '../config/emailAccounts.js';
const email_gatewayRouter=express.Router();
async function logLatestEmails(to) {
  const client = getImapClientByEmail(to);
  if (!client) {
    console.error('❌ Không có IMAP connection cho email:', to);
    return;
  }

  const lock = await client.getMailboxLock('INBOX');
  try {
    // Lấy số lượng thư
    const total = client.mailbox.exists;
    const start = Math.max(1, total - 19); // Lấy 20 thư cuối cùng

    const messages = client.fetch(`${start}:${total}`, { envelope: true });
    console.log(`📬 Danh sách 20 email mới nhất trong INBOX của ${to}:`);

    for await (const msg of messages) {
      const id = msg.envelope?.messageId || '(không có)';
      const subject = msg.envelope?.subject || '(không tiêu đề)';
      const from = msg.envelope?.from?.[0]?.address || '(không xác định)';
      const date = msg.envelope?.date?.toISOString() || '(không có ngày)';
      console.log(`- Message-ID: ${id}`);
      console.log(`  Từ: ${from}`);
      console.log(`  Ngày: ${date}`);
      console.log(`  Tiêu đề: ${subject}`);
      console.log('------------------------------------');
    }
  } catch (err) {
    console.error('❌ Lỗi khi log email:', err);
  } finally {
    lock.release();
  }
}

email_gatewayRouter.get('/', async (req, res) => {
  const { lastMessageId, to } = req.query;
  logLatestEmails(to);
  console.log(`Last message id là: ${lastMessageId} của ${to}`);
  
  const client = getImapClientByEmail(to);
  if (!client) return res.status(404).json({ error: 'Không có IMAP connection cho email này' });

  try {
    const lock = await client.getMailboxLock('INBOX');
    try {
      const search = await client.search({ header: { 'message-id': lastMessageId } });
      if (!search.length) return res.status(404).json({ error: 'Không tìm thấy email' });

      const msg = await client.fetchOne(search[0], { source: true });
      const parsed = await simpleParser(msg.source);

      res.json({
        subject: parsed.subject,
        html: parsed.html,
        content: parsed.text
      });
    } finally {
      lock.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi đọc email' });
  }
});
export default email_gatewayRouter;