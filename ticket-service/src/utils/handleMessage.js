import { simpleParser } from "mailparser";
import { saveTicketFromEmail } from "../services/emailProccessor.js";
import { ticket } from "../models/ticketDB.js";
import { sendKafkaMessage } from "../services/sendKafkaMessage.js";

const handleIncomingEmails = async (data) => {
  if (!data || !data.raw) return null;

  try {
    const parsed = await simpleParser(data.raw);

    const parsedTicket = {
      from: parsed.from?.value?.[0]?.address || 'unknown',
      to: parsed.to?.value?.map(t => t.address).join(',') || 'unknown',
      subject: parsed.subject || '(no subject)',
      date: parsed.date?.toISOString?.() || new Date().toISOString(),
      html: parsed.html || '',
      attachments: parsed.attachments || []
    };

    await saveTicketFromEmail(parsedTicket);

  } catch (error) {
    console.error("Lỗi xử lý email:", error);
    return null;
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
      ticketSave.dueDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

      await ticketSave.save();

      await sendKafkaMessage('ticket-distribution', {
        ticketServerId: ticketSave.ticketId,
        html:ticketSave.html,
        from: ticketSave.from,
        to: ticketSave.to,
        subject: ticketSave.subject,
        assignedEmployee: ticketSave.assignedEmployee,
        receivedDate: ticketSave.receivedDate,
        dueDate: ticketSave.dueDate,
        status: ticketSave.status
      });

      console.log(`Updated ticket ${ticketId}: assigned to ${assignedTo}`);
      return true;

    } else if (type === 'close_ticket') {
      ticketSave.status = 'closed';
      ticketSave.assignedEmployee = null;

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
const handleIgnoreTicket = async (data) => {
  try {
    // 1. Tìm ticket hiện tại
    const ticketRecord = await ticket.findOne({ where: { ticketId: data.ticketId } });

    if (!ticketRecord) {
      throw new Error(`Ticket with ID ${data.ticketId} not found`);
    }

    // 2. Lấy danh sách ignoredEmployees và cập nhật nếu chưa có
    let ignored = [];
    try {
      ignored = JSON.parse(ticketRecord.ignoredEmployees || '[]');
    } catch (e) {
      console.warn('Invalid ignoredEmployees JSON:', ticketRecord.ignoredEmployees);
    }

    if (!ignored.includes(data.agentId)) {
      ignored.push(data.agentId);
    }

    // 3. Cập nhật lại bản ghi
    await ticket.update(
      { ignoredEmployees: JSON.stringify(ignored) },
      { where: { ticketId: data.ticketId } }
    );

    // 4. Gửi Kafka
    await sendKafkaMessage('ticket', {
      ticketId: data.ticketId,
      ignoredEmployees: ignored
    });

  } catch (error) {
    console.error('Error in handleIgnoreTicket:', error.message);
    throw error;
  }
};

export {
  handleIncomingEmails,
  handleACDResult,
  handleIgnoreTicket,
};
