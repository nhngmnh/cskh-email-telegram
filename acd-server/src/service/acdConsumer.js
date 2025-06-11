import { consumer } from "../utils/kafkaConsumer.js";
import { handleTicketDistribution, handleUpdateEmployee } from "../utils/handleMessage.js";
async function startAcdConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'ticket', fromBeginning: false });
  await consumer.subscribe({ topic: 'update-employee', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      try {
           const parsed = JSON.parse(message.value.toString());

        // Xử lý phân phối ở đây
        if (topic ==='ticket') await handleTicketDistribution(parsed);
        else if (topic==='update-employee') await handleUpdateEmployee(parsed);
      } catch (err) {
        console.error('Invalid message format or error handling:', err);
      }
    }
  });
}
export default startAcdConsumer;