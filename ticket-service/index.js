import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { consumeMessages } from './utils/kafkaConsumer.js';
const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`🎫 Ticket Service listening on port ${port}`);
});

// Start Kafka consumer
consumeMessages();
