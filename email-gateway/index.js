import dotenv from 'dotenv'

dotenv.config();
import { startAllImapIdle } from './src/services/imapService.js';
import { listenForAgentResponse } from './src/utils/kafkaConsumer.js';
import { sendEmail } from './src/services/smtpService.js';
import runSimpleImapTest from './src/test/runIMAPTest.js';
const bootstrap = async () => {
  try {
    console.log('[email-gateway] Service starting...');
     
   startAllImapIdle(); 
  //runSimpleImapTest();
    listenForAgentResponse(); 

    console.log('[email-gateway] Service initialized successfully.');
  } catch (err) {
    console.error('[email-gateway] Service failed to start:', err);
    process.exit(1);
  }
}


bootstrap();