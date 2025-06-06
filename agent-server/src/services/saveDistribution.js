import { ticket_agent } from "../models/ticket-agentDB.js";

async function upsertTicketAgent(ticketData) {
  const {
    ticketServerId,
    lastMessageId,
    from,
    to,
    assignedEmployee,
    receivedDate,
    dueDate,
  } = ticketData;

  try {
    const [ticket, created] = await ticket_agent.upsert(
      {
        ticketServerId,
        lastMessageId,
        from,
        to,
        assignedEmployee,
        receivedDate,
        dueDate,
      },
      { returning: true }
    );

    console.log(`Ticket ${created ? 'created' : 'updated'}: ${ticketServerId}`);
    return ticket;
  } catch (error) {
    console.error('Failed to upsert ticket-agent record:', error);
    throw error;
  }
}

export {
  upsertTicketAgent,
};