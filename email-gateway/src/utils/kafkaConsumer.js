import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'email-gateway',
     brokers: process.env.KAFKA_BROKER.split(',')
});

const consumer = kafka.consumer({ groupId: 'email-gateway-group' });

export async function listenForAgentResponse() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'agent-responses', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const content = JSON.parse(message.value.toString());
      console.log('[Kafka] Agent response received:', content);
    }
  });

  console.log('[Kafka] Subscribed to agent-responses topic');
}
