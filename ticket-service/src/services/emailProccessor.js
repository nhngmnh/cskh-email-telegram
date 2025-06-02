import { ticket as Ticket, sequelize } from "../models/ticketDB.js";

async function saveTicketFromEmail(parsedEmail) {
  if (!parsedEmail) {
    return null; // Không có dữ liệu
  }

  try {
    // Nếu email là trả lời (có inReplyTo), thử tìm ticket cũ để cập nhật
    let updatedOrCreatedTicket = null;

    if (parsedEmail.replyTo) {
      const existingTicket = await Ticket.findOne({
        where: {
          lastMessageId: parsedEmail.replyTo
        }
      });

      if (existingTicket) {
        // Cập nhật ticket cũ
        existingTicket.lastMessageId = parsedEmail.messageId;
        existingTicket.receivedDate = parsedEmail.date || new Date();
        existingTicket.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        existingTicket.status = 'open';

        await existingTicket.save();
        updatedOrCreatedTicket = existingTicket;
      }
    }

    if (!updatedOrCreatedTicket) {
      // Nếu không tìm thấy ticket cũ, tạo mới
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
      updatedOrCreatedTicket = newTicket;
    }

    return updatedOrCreatedTicket;

  } catch (error) {
    console.error('Error saving ticket from email:', error);
    return null;
  }
}

export {
  saveTicketFromEmail,
};
