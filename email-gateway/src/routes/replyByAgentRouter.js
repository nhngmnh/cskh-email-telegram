// routes/emailReply.js
import express from 'express';
import { sendReplyEmail } from '../services/smtpService.js';

const replyRouter = express.Router();

replyRouter.post('/', async (req, res) => {
  const { from, to, subject, html, inReplyTo, references } = req.body;

  if (!from || !to || !html || !inReplyTo) {
    return res.status(400).json({ error: 'Missing required fields: from, to, html, inReplyTo' });
  }

  try {
    const info = await sendReplyEmail(from, to, subject, html, inReplyTo, references );
    res.json({ message: 'Reply sent', messageId: info.messageId });
  } catch (err) {
    console.error('[SMTP] Failed to send reply:', err.message);
    res.status(500).json({ error: 'Failed to send reply email' });
  }
});

export default replyRouter;
