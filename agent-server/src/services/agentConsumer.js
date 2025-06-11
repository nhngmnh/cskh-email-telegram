// service/agentConsumer.js
import { consumer } from '../config/kafkaConfig.js';
import { insertTicketAgent } from './saveDistribution.js';

async function startAgentConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'ticket-distribution', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        console.log('Received distribution:', data);
        await insertTicketAgent(data);
    
      } catch (err) {
        console.error('Error handling ticket-distribution message:', err);
      }
    }
  });
}

export default startAgentConsumer;
