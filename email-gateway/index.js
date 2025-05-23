import dotenv from 'dotenv'

dotenv.config();
import { startImapIdle } from './src/services/imapService.js';
import { listenForAgentResponse } from './src/utils/kafkaConsumer.js';
const bootstrap = async()=> {
  try {
    console.log('[email-gateway] Service starting...');

    await startImapIdle();

    await listenForAgentResponse();

    console.log('[email-gateway] Service initialized successfully.');
  } catch (err) {
    console.error('[email-gateway] Service failed to start:', err);
    process.exit(1);
  }
}

bootstrap();