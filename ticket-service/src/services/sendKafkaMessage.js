import { ticketProducer } from '../config/kafkaConfig.js';

export async function sendKafkaMessage(topic, data) {
  if (!topic || !data) {
    console.error('[Kafka] Missing topic or data');
    return;
  }

  try {
    await ticketProducer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }]
    });
    console.log(`[Kafka] Sent message to ${topic}`);
  } catch (err) {
    console.error(`[Kafka] Failed to send message to ${topic}:`, err);
  }
}
