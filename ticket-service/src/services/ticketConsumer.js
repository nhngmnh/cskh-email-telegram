import { ticketConsumer } from "../config/kafkaConfig.js";


export async function startTicketConsumer() {
  await ticketConsumer.connect();
  console.log('[Kafka] Connected to Kafka as ticket-service');

  await ticketConsumer.subscribe({ topic: 'acd-tickets', fromBeginning: false });
  await ticketConsumer.subscribe({ topic: 'sending-emails', fromBeginning: false });
  await ticketConsumer.subscribe({ topic: 'agent-responses', fromBeginning: false });

  await ticketConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`[Kafka] Received message on topic ${topic}:`, value);

      try {
        const data = JSON.parse(value);
        // Xử lý từng topic cụ thể
        switch (topic) {
          case 'acd-tickets':
            handleAcdTicket(data);
            break;
          case 'sending-emails':
            handleSendingEmail(data);
            break;
          case 'agent-responses':
            handleAgentResponse(data);
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
function handleAcdTicket(data) {
  console.log('[TicketService] Handling ACD Ticket:', data);
  // TODO: add logic to process ticket
}

function handleSendingEmail(data) {
  console.log('[TicketService] Handling Sending Email:', data);
  // TODO: add logic to process email sending info
}

function handleAgentResponse(data) {
  console.log('[TicketService] Handling Agent Response:', data);
  // TODO: add logic to attach response to ticket
}