import { ImapFlow } from 'imapflow';
import 'dotenv/config'; // Để tải biến môi trường từ .env

// Cấu hình tài khoản email của bạn
// Hãy đảm bảo các biến môi trường này được đặt trong file .env
// ví dụ: EMAIL_USER=your_email@gmail.com, EMAIL_APP_PASSWORD=your_app_password
const EMAIL_USER = process.env.IMAP_USER;
const EMAIL_APP_PASSWORD = process.env.IMAP_PASS;
const IMAP_HOST = process.env.IMAP_HOST || 'imap.gmail.com';
const IMAP_PORT = parseInt(process.env.IMAP_PORT || '993', 10);
const IMAP_SECURE = process.env.IMAP_SECURE === 'true' || true; // Mặc định là true

async function runSimpleImapTest() {
    if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
        console.error("Vui lòng cấu hình EMAIL_USER và EMAIL_APP_PASSWORD trong file .env");
        return;
    }

    console.log(`Đang kết nối IMAP cho: ${EMAIL_USER}`);

    const client = new ImapFlow({
        host: IMAP_HOST,
        port: IMAP_PORT,
        secure: IMAP_SECURE,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_APP_PASSWORD
        },
        // Tăng timeout để tránh bị ngắt kết nối quá sớm khi test
        timeout: 60 * 1000 // 60 giây
    });

    // Lắng nghe các sự kiện cơ bản
    client.on('error', err => {
        console.error(`[IMAP Error] Lỗi kết nối IMAP:`, err);
    });

    client.on('close', () => {
        console.warn(`[IMAP Close] Kết nối IMAP đã đóng.`);
    });

    try {
        // 1. Kết nối đến máy chủ IMAP
        await client.connect();
        console.log(`Đã kết nối thành công đến ${EMAIL_USER}.`);

        // 2. Mở hộp thư 'INBOX'
        await client.mailboxOpen('INBOX');
        console.log(`Đã mở hộp thư 'INBOX'.`);

        // 3. Lắng nghe sự kiện email mới ('exists')
        client.on('exists', async () => {
            console.log(`[IMAP Event] Phát hiện email mới!`);
            let latestMessage;
            // Để đơn giản, chỉ lấy email mới nhất.
            // Trong ứng dụng thực tế, bạn sẽ cần quản lý UID để không fetch trùng lặp.
            for await (const message of client.fetch({ uid: '*' }, {
                envelope: true,
                uid: true,
                internalDate: true
            })) {
                // Trong test đơn giản này, ta chỉ cần lưu tin nhắn cuối cùng để in ra.
                // Trong ứng dụng thực tế, bạn sẽ xử lý từng tin nhắn ở đây.
                latestMessage = message;
            }

            if (latestMessage) {
                console.log("--- Thông tin email mới nhất ---");
                console.log(`UID: ${latestMessage.uid}`);
                console.log(`Từ: ${latestMessage.envelope.from?.[0]?.address || 'unknown'}`);
                console.log(`Chủ đề: ${latestMessage.envelope.subject || '(No Subject)'}`);
                console.log(`Ngày: ${latestMessage.internalDate?.toISOString() || 'unknown'}`);
                console.log("---------------------------------");
            } else {
                console.log("Không tìm thấy email mới nào có thể fetch.");
            }
        });

        // 4. Bắt đầu chế độ IDLE để chờ email
        console.log("Đang lắng nghe email mới (chế độ IDLE). Nhấn Ctrl+C để thoát.");
        // client.idle() sẽ giữ kết nối mở và chờ đợi, không bao giờ tự kết thúc
        await client.idle();

    } catch (err) {
        console.error(`[IMAP Test Failed] Không thể chạy test IMAP:`, err);
    } finally {
        // Đảm bảo đóng kết nối khi thoát chương trình
        // client.logout() sẽ được gọi khi ứng dụng kết thúc
        // hoặc khi có lỗi nghiêm trọng không thể phục hồi
        process.on('SIGINT', async () => {
            if (client && client.connected) {
                console.log("\nĐang đóng kết nối IMAP...");
                await client.logout();
                console.log("Đã đóng kết nối IMAP.");
            }
            process.exit(0);
        });
    }
}

export default runSimpleImapTest