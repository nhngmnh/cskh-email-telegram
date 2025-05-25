import { Kafka } from 'kafkajs';
import dotenv from 'dotenv'
dotenv.config();
const kafka = new Kafka({
  clientId: 'ticket-service',
  brokers: [process.env.KAFKA_BROKER], // Cập nhật lại nếu cần
});

// Kafka Producer cho các topic: incoming-emails, sending-tickets
export const ticketProducer = kafka.producer();

// Kafka Consumer cho các topic: acd-tickets, sending-emails, agent-responses
export const ticketConsumer = kafka.consumer({ groupId: 'ticket-service-group' });

// Hàm khởi tạo producer
export async function initKafkaProducer() {
  await ticketProducer.connect();
  console.log('[Kafka] Producer connected (ticket-service)');
}

// Hàm khởi tạo consumer
export async function initKafkaConsumer() {
  await ticketConsumer.connect();
  console.log('[Kafka] Consumer connected (ticket-service)');
}
