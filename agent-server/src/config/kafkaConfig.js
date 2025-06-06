import { Kafka } from 'kafkajs';
import dotenv from 'dotenv'
dotenv.config()
const kafka = new Kafka({
  clientId: 'agent-service', // hoặc 'acd-service' tuỳ phía nào dùng
  brokers: [process.env.KAFKA_BROKER], // Sửa theo địa chỉ Kafka thực tế
});

const consumer = kafka.consumer({ groupId: 'agent-group' });
const producer = kafka.producer();

export { kafka, consumer, producer };