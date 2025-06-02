import { simpleParser } from "mailparser";
import { saveTicketFromEmail } from "../services/emailProccessor.js";

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

export {
  handleIncomingEmails
};
