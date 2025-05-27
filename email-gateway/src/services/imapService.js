import { ImapFlow } from 'imapflow';
import { sendToKafka } from '../utils/kafkaProducer.js';
import { emailAccounts } from '../config/emailAccounts.js';

async function startImapIdle(email, account) {
    let client;
    let lastUid = 0;
    let reconnectTimeoutId = null;

    // --- Hàm trợ giúp: Lên lịch kết nối lại ---
    const scheduleReconnect = (delay = 3000) => {
        if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
        console.warn(`[IMAP] Scheduling reconnect for ${email} in ${delay} ms...`);
        reconnectTimeoutId = setTimeout(connect, delay);
    };

    // --- Hàm chính để kết nối và duy trì IDLE ---
    const connect = async () => {
        if (client?.connected) {
            console.log(`[IMAP] Client for ${email} already connected. Skipping reconnect.`);
            return;
        }

        if (!account?.imap?.host || !account?.imap?.port || !account?.appPassword) {
            console.error(`[IMAP] Invalid configuration for ${email}. Please check config/emailAccounts.js.`);
            return;
        }

        client = new ImapFlow({
            host: account.imap.host,
            port: account.imap.port,
            secure: account.imap.secure,
            auth: { user: email, pass: account.appPassword },
            timeout: 60 * 1000,
            maxIdleTime: 10 * 60 * 1000 //10 phut
        });

        // --- Thiết lập các sự kiện cho client ---
        client.on('error', async err => {
            console.error(`[IMAP] Connection error for ${email}:`, err);
            if (client?.connected) { // Cố gắng logout nếu client vẫn báo là connected
                try {
                    await client.logout();
                    console.log(`[IMAP] Forced logout after error for ${email}.`);
                } catch (logoutErr) {
                    console.warn(`[IMAP] Error during forced logout after error for ${email}:`, logoutErr);
                }
            }
            scheduleReconnect(); // Luôn lên lịch reconnect sau lỗi
        });

        client.on('close', async () => {
            console.warn(`[IMAP] Connection closed for ${email}.`);
            scheduleReconnect();
        });

        // Xử lý khi có email mới (sự kiện 'exists')
       let isFetching = false;

client.on('exists', async () => {
    if (isFetching) {
        console.log(`[IMAP] Already fetching emails for ${email}, skipping this exists event.`);
        return;
    }

    isFetching = true;
    console.log(`[IMAP] New email detected for ${email}. Fetching...`);

    try {
        const newUids = await client.search({ uid: `${lastUid + 1}:*` });

        if (newUids.length === 0) {
            console.log(`[IMAP] No truly new emails found for ${email} beyond lastUid ${lastUid}.`);
            isFetching = false;
            return;
        }

        let maxUidInBatch = lastUid;
        const sendTasks = [];

        for await (const message of client.fetch(newUids, {
            envelope: true,
            source: true,
            uid: true,
            internalDate: true
        })) {
            const parsedEmail = {
                from: message.envelope.from?.[0]?.address || 'unknown',
                to: message.envelope.to?.map(t => t.address).join(', ') || 'unknown',
                subject: message.envelope.subject || '(No Subject)',
                date: message.internalDate?.toISOString() || new Date().toISOString(),
                raw: message.source?.toString() || ''
            };

            // Đẩy promise gửi Kafka vào mảng, không await tại đây
            const sendPromise = sendToKafka('incoming-emails', parsedEmail)
                .then(() => {
                    console.log(`[Kafka] Successfully sent email UID ${message.uid} from ${email} to Kafka.`);
                })
                .catch(err => {
                    console.error(`[Kafka] Failed to send email UID ${message.uid} from ${email} to Kafka:`, err);
                });

            sendTasks.push(sendPromise);

            if (message.uid > maxUidInBatch) {
                maxUidInBatch = message.uid;
            }
        }

        // Đợi tất cả các email được gửi xong
        await Promise.all(sendTasks);

        lastUid = maxUidInBatch;
        console.log(`[IMAP] Finished processing new emails for ${email}. lastUid updated to ${lastUid}.`);

    } catch (err) {
        if (err.code === 'NoConnection') {
            console.warn(`[IMAP] No active connection for ${email} during fetch. Will attempt reconnect.`);
            scheduleReconnect();
        } else {
            console.error(`[IMAP] Error fetching new emails for ${email}:`, err);
        }
    } finally {
        isFetching = false;
    }
});


        // --- Bắt đầu kết nối ---
        try {
            await client.connect();
            console.log(`[IMAP] Successfully connected to ${email} at ${account.imap.host}:${account.imap.port}.`);

            await client.mailboxOpen('INBOX');
            const status = await client.status('INBOX', { uidNext: true });

            if (status.uidNext && status.uidNext > 1) {
                lastUid = status.uidNext - 1;
            } else {
                const latestMessages = await client.search({ all: true }, { uid: true, limit: 1, reverse: true });
                if (latestMessages.length > 0) {
                    lastUid = latestMessages[0].uid;
                } else {
                    lastUid = 0;
                }
            }

            console.log(`[IMAP] Listening for new emails on ${email} (initialized lastUid: ${lastUid}).`);

            await client.idle();
            console.log(`[IMAP] IMAP IDLE started for ${email}.`);

        } catch (err) {
            console.error(`[IMAP] Initial connection failed for ${email}:`, err);
            if (client?.connected) {
                try {
                    await client.logout();
                } catch (logoutErr) {
                    console.error(`[IMAP] Error during logout after failed connection for ${email}:`, logoutErr);
                }
            }
            scheduleReconnect();
        }
    };

    connect();
}

export async function startAllImapIdle() {
    console.log("[IMAP] Starting all IMAP idle processes...");
    Object.keys(emailAccounts).forEach(email => {
        startImapIdle(email, emailAccounts[email]);
    });
    console.log("[IMAP] All IMAP idle processes initiated. They will handle reconnections automatically.");
}