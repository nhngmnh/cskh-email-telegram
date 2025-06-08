import { ticket_agent } from "../models/ticket-agentDB.js";

async function insertTicketAgent(ticketData) {
  const {
    ticketServerId,
    from,
    to,
    subject,
    assignedEmployee,
    receivedDate,
    dueDate,
    html,
    attachments,
    status
  } = ticketData;
  try {
    const newTicket = await ticket_agent.create({
      ticketServerId,
      from,
      subject,
      to,
      assignedEmployee,
      receivedDate,
      dueDate,
      html,
      attachments,
      status
    });

    console.log(`Inserted new ticket-agent record: ${newTicket.ticketServerId}`);
    return newTicket;
  } catch (error) {
    console.error("Failed to insert ticket-agent record:", error);
    throw error;
  }
}

export {
  insertTicketAgent,
};
