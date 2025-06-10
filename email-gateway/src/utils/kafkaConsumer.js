import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { sendReplyEmail } from '../services/smtpService.js';

dotenv.config();

const kafka = new Kafka({
  clientId: 'email-gateway',
  brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'email-gateway-group' });

export async function listenForAgentResponse() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'agent-responses', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const { ticketId,subject, from, to, message: rawMessage } = JSON.parse(message.value.toString());

        await sendReplyEmail(from, to, subject, rawMessage);

        console.log(`[Kafka] Email sent for ticket ${ticketId} from ${from} to ${to}`);
      } catch (err) {
        console.error('[Kafka] Failed to handle agent response:', err.message);
      }
    },
  });

  console.log('[Kafka] Subscribed to agent-responses topic');
}
