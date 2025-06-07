import dotenv from 'dotenv'

dotenv.config();
import { startAllImapIdle } from './src/services/imapService.js';
import { listenForAgentResponse } from './src/utils/kafkaConsumer.js';
//import runSimpleImapTest from './src/test/runIMAPTest.js';
import cors from 'cors'
import express from 'express'
import email_gatewayRouter from './src/routes/emailContentRoute.js';
import replyRouter from './src/routes/replyByAgentRouter.js';
const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/emails/content',email_gatewayRouter);
app.use('/reply-email',replyRouter)
const bootstrap = async () => {
  try {
    console.log('[email-gateway] Service starting...');
         app.listen(PORT, () => {
  console.log(`Agent server running on port ${PORT}`);
});
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
