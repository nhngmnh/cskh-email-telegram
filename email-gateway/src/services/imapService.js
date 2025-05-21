import { ImapFlow } from 'imapflow';
import { sendToKafka } from '../utils/kafkaProducer.js';

const client = new ImapFlow({
  host: process.env.IMAP_HOST,
  port: Number(process.env.IMAP_PORT),
  secure: true,
  auth: {
    user: process.env.IMAP_USER,
    pass: process.env.IMAP_PASS
  }
});

export async function startImapIdle() {
  await client.connect();
  await client.mailboxOpen('INBOX');

  let lastUid = client.mailbox.exists;

  client.on('exists', async () => {
    const newUids = await client.search({ uid: `${lastUid + 1}:*` });

    for await (let message of client.fetch(newUids, { envelope: true, source: true, uid: true })) {
      const parsedEmail = {
        subject: message.envelope.subject,
        from: message.envelope.from[0].address,
        raw: message.source.toString()
      };

      console.log('[IMAP] New email received:', parsedEmail.subject);
      await sendToKafka('incoming-emails', parsedEmail);

      lastUid = message.uid; // Cập nhật UID sau mỗi email
    }
  });

  console.log('[IMAP] Listening for new emails...');
}
