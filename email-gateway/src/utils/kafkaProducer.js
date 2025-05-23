import { Kafka } from 'kafkajs';
import dotenv from 'dotenv'

dotenv.config();
const kafka = new Kafka({
  clientId: 'email-gateway',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

await producer.connect();

export async function sendToKafka(topic, message) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  });
}
