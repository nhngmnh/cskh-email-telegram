import dotenv from 'dotenv'

dotenv.config();
import { startImapIdle } from './src/services/imapService.js';
import { listenForAgentResponse } from './src/utils/kafkaConsumer.js';
import { sendEmail } from './src/services/smtpService.js';
const bootstrap = async()=> {
  try {
    console.log('[email-gateway] Service starting...');
 await sendEmail(
      'nhungocminh2004@gmail.com',              // Email người nhận
      'Thử nghiệm gửi email',              // Tiêu đề
      '<p>Xin chào! Đây là email test gửi bằng SMTP Service.</p>'  // Nội dung HTML
    );
    await startImapIdle();

    await listenForAgentResponse();

    console.log('[email-gateway] Service initialized successfully.');
  } catch (err) {
    console.error('[email-gateway] Service failed to start:', err);
    process.exit(1);
  }
}

bootstrap();