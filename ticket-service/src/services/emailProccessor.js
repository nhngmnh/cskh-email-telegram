import { ticket as Ticket, sequelize } from "../models/ticketDB.js";
import { sendKafkaMessage } from "./sendKafkaMessage.js";

async function saveTicketFromEmail(parsedEmail) {
  if (!parsedEmail) return null;

  try {
    // Luôn tạo ticket mới, không kiểm tra replyTo nữa
    const ticketData = {
      subject: parsedEmail.subject || '',
      from: parsedEmail.from || '',
      to: parsedEmail.to || '',
      assignedEmployee: null,
      ignoredEmployees: [],
      receivedDate: parsedEmail.date || new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'open',
      html: parsedEmail.html || '',
      attachments: JSON.stringify(parsedEmail.attachments || [])
    };

    const newTicket = await Ticket.create(ticketData);

    console.log(`Ticket mới được tạo: ticketId=${newTicket.ticketId}`);

    // Gửi Kafka
    await sendKafkaMessage('ticket', {
      ticketId: newTicket.ticketId,
      ignoredEmployees: newTicket.ignoredEmployees || []
    });

    return newTicket;

  } catch (error) {
    console.error('Error saving ticket from email:', error);
    return null;
  }
}

export { saveTicketFromEmail };
