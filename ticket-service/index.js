import { initKafkaProducer, initKafkaConsumer } from './src/config/kafkaConfig.js';
import { startTicketConsumer } from './src/services/ticketConsumer.js';
import dotenv from 'dotenv'
dotenv.config();
async function startApp() {
  try {
    await initKafkaProducer();
    await initKafkaConsumer();
    await startTicketConsumer();
  } catch (err) {
    console.error('[Startup] Error:', err);
    process.exit(1);
  }
}

startApp();