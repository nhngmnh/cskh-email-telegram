import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { handleEmailMessage } from '../controllers/ticketController.js';

dotenv.config(); // Đảm bảo load biến môi trường

const kafka = new Kafka({
  clientId: 'ticket-service',
  brokers: [process.env.KAFKA_BROKER], // ví dụ: kafka:9092
});

const consumer = kafka.consumer({ groupId: 'ticket-group' });

export const consumeMessages = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'email-topic', fromBeginning: false });

    console.log('✅ Ticket Service connected to Kafka and subscribed to email-topic');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const msg = message.value.toString();
        console.log(`📨 Received message: ${msg}`);

        try {
          const parsed = JSON.parse(msg);
          await handleEmailMessage(parsed); // Gọi xử lý ticket từ email
        } catch (err) {
          console.error('❌ Error processing message:', err);
        }
      },
    });
  } catch (err) {
    console.error('❌ Kafka connection error:', err);
  }
};
