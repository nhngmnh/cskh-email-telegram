import { getImapClientByEmail } from '../services/imapService.js';
import { simpleParser } from 'mailparser';
import express from 'express';
import { emailAccounts } from '../config/emailAccounts.js';
const email_gatewayRouter=express.Router();
email_gatewayRouter.get('/', async (req, res) => {
  const { lastMessageId, to } = req.query;

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