import { ticket as Ticket, sequelize } from "../models/ticketDB.js";
import { sendKafkaMessage } from "./sendKafkaMessage.js";

async function saveTicketFromEmail(parsedEmail) {
  if (!parsedEmail) return null;

  try {
    // Nếu là email trả lời thì tìm ticket cũ để cập nhật
    if (parsedEmail.replyTo) {
      const existingTicket = await Ticket.findOne({
        where: { lastMessageId: parsedEmail.replyTo }
      });

      if (existingTicket) {
        existingTicket.lastMessageId = parsedEmail.messageId;
        existingTicket.receivedDate = parsedEmail.date || new Date();
        existingTicket.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        existingTicket.status = 'open';

        await existingTicket.save();
        return existingTicket; // Không gửi Kafka nếu chỉ cập nhật
      }
    }

    // Nếu không tìm thấy ticket cũ thì tạo mới
    const ticketData = {
      subject: parsedEmail.subject || '',
      from: parsedEmail.from || '',
      to: parsedEmail.to || '',
      assignedEmployee: null,
      ignoredEmployees: [],
      lastMessageId: parsedEmail.messageId || null,
      receivedDate: parsedEmail.date || new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'open'
    };

    const newTicket = await Ticket.create(ticketData);

    // Gửi Kafka chỉ khi tạo mới
   
   await sendKafkaMessage('ticket', {
  ticketId: newTicket.ticketId,
  ignoredEmployees: newTicket.ignoredEmployees || []
});

    console.log(newTicket.ticketId);
    return newTicket;

  } catch (error) {
    console.error('Error saving ticket from email:', error);
    return null;
  }
}

export { saveTicketFromEmail };
