import { simpleParser } from "mailparser";
import { saveTicketFromEmail } from "../services/emailProccessor.js";
import { ticket } from "../models/ticketDB.js";
import { sendKafkaMessage } from "../services/sendKafkaMessage.js";

const handleIncomingEmails = async (data) => {
  if (!data || !data.raw) {
    return null;
  }

  try {
    const parsed = await simpleParser(data.raw);

    const parsedTicket = {
      from: parsed.from?.text || '',                   // email người gửi
      to: parsed.to?.text || '',                       // email người nhận
      subject: parsed.subject || '(no subject)',       // chủ đề
      date: parsed.date || new Date(),                 // thời gian nhận
      messageId: parsed.messageId || null,             // ID duy nhất của email này
      replyTo: parsed.inReplyTo || null                // ID email trước (nếu là reply)
    };

    await saveTicketFromEmail(parsedTicket);
  } catch (error) {
    console.error("Lỗi xử lý email:", error);
    return null; // Bỏ qua email lỗi
  }
};
const handleACDResult = async (data) => {
  try {
    const { type, ticketId, assignedTo } = data;

    if (!ticketId || !type) {
      console.log("Invalid ACD result:", data);
      return;
    }

    const ticketSave = await ticket.findOne({ where: { ticketId } });

    if (!ticketSave) {
      console.log(`Ticket ${ticketId} not found in DB`);
      return;
    }

    if (type === 'distribution_result') {
      if (!assignedTo) {
        console.log("Missing assignedTo in distribution_result:", data);
        return;
      }

      ticketSave.assignedEmployee = assignedTo;
      ticketSave.dueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // +2 ngày

      await ticketSave.save();

      // Gửi message tiếp nếu cần
      await sendKafkaMessage('ticket-distribution', {
        ticketServerId:ticketSave.ticketId,
        from: ticketSave.from,
        to: ticketSave.to,
        lastMessageId: ticketSave.lastMessageId,
        assignedEmployee: ticketSave.assignedEmployee,
        receivedDate: ticketSave.receivedDate,
        dueDate:ticketSave.dueDate,
        status:ticketSave.status
      });

      console.log(`Updated ticket ${ticketId}: assigned to ${assignedTo}, due in 2 days`);
      return true;

    } else if (type === 'close_ticket') {
      // Xử lý đóng ticket, ví dụ set trạng thái closed
      ticketSave.status = 'closed';
      ticketSave.assignedEmployee = null;  // hoặc giữ nguyên tùy logic bạn muốn

      await ticketSave.save();

      console.log(`Closed ticket ${ticketId}`);
      return true;

    } else {
      console.warn("Unknown ACD result type:", type);
      return false;
    }

  } catch (err) {
    console.error("Error handling ACD result:", err);
    return false;
  }
};

export {
  handleIncomingEmails,handleACDResult
};
