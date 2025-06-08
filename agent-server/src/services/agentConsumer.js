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
        // Xử lý phân phối: ghi log, cập nhật UI, gửi thông báo,...
        global.agentAssignments = global.agentAssignments || [];
        global.agentAssignments.push({
          ...data,
          timestamp: new Date(),
        });

      } catch (err) {
        console.error('Error handling ticket-distribution message:', err);
      }
    }
  });
}

export default startAgentConsumer;
