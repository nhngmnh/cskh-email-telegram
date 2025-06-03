import { consumer } from "../utils/kafkaConsumer.js";
import { handleTicketDistribution } from "../utils/handleTicketDistribution.js";
async function startAcdConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'ticket', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      
      try {
           const ticketInfo = JSON.parse(message.value.toString());
        console.log('Received ticket:', typeof(ticketInfo));

        // Xử lý phân phối ở đây
        await handleTicketDistribution(ticketInfo);

      } catch (err) {
        console.error('Invalid message format or error handling:', err);
      }
    }
  });
}
export default startAcdConsumer;