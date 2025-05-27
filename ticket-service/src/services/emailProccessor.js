import { TicketMessage,TicketDistribution,sequelize } from "../models/ticketDB.js";

async function saveTicketFromEmail(parsedEmail) {
  if (!parsedEmail) {
    // Dữ liệu không hợp lệ, trả về null
    return null;
  }

  try {
    const ticketDistributionData = {
      messageId: parsedEmail.messageId || null,
      from: parsedEmail.from || '',
      to: parsedEmail.to || '',
      assignedEmployee: null,
      previousTicketId: null,
      receivedDate: parsedEmail.date || new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // hạn 7 ngày sau
      status: 'pending',
    };

    // Dùng sequelize.transaction chứ không phải ticketDistributionModel.sequelize
    const result = await sequelize.transaction(async (t) => {
      const ticketDist = await TicketDistribution.create(ticketDistributionData, { transaction: t });

      const ticketMessageData = {
        ticketId: ticketDist.ticketId,
        incomingMessage: parsedEmail.body || '',
        responseMessage: null,
      };

      const ticketMsg = await TicketMessage.create(ticketMessageData, { transaction: t });

      return { ticketDist, ticketMsg };
    });

    return result;
  } catch (error) {
    console.error('Error saving ticket from email:', error);
    return null; // Trả về null nếu có lỗi trong quá trình lưu
  }
}

export {
  saveTicketFromEmail,
};