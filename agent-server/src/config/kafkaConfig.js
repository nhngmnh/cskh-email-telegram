import { Kafka } from 'kafkajs';
import dotenv from 'dotenv'
dotenv.config()
const kafka = new Kafka({
  clientId: 'agent-service',
  brokers: [process.env.KAFKA_BROKER], 
});

const consumer = kafka.consumer({ groupId: 'agent-group' });
const producer = kafka.producer();

export { kafka, consumer, producer };