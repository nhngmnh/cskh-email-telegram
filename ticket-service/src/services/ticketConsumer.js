import { ticketConsumer } from "../config/kafkaConfig.js";
import { handleACDResult, handleIgnoreTicket, handleIncomingEmails } from "../utils/handleMessage.js";


export async function startTicketConsumer() {
  await ticketConsumer.connect();
  console.log('[Kafka] Connected to Kafka as ticket-service');

  await ticketConsumer.subscribe({ topic: 'ignore-ticket', fromBeginning: false });
  await ticketConsumer.subscribe({ topic: 'incoming-emails', fromBeginning: false });
  await ticketConsumer.subscribe({ topic: 'acd-result', fromBeginning: false });
  await ticketConsumer.subscribe({ topic: 'agent-responses', fromBeginning: false });

  await ticketConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`[Kafka] Received message on topic ${topic}:`, value);

      try {
        const data = JSON.parse(value);
        // Xử lý từng topic cụ thể
        switch (topic) {
          case 'ignore-ticket':
            handleIgnoreTicket(data);
            break;
          case 'incoming-emails':
            handleIncomingEmails(data);
             
            break;
          case 'agent-responses':
            handleAgentResponse(data);
            break;
          case 'acd-result':
            handleACDResult(data)
            break;
          default:
            console.warn(`[Kafka] Unknown topic: ${topic}`);
        }
      } catch (err) {
        console.error('[Kafka] Failed to process message:', err);
      }
    }
  });
}
function handleAgentResponse(data) {
  console.log('[TicketService] Handling Agent Response:', data);
  // TODO: add logic to attach response to ticket
}