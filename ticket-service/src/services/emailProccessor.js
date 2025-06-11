import { ticket as Ticket, sequelize } from "../models/ticketDB.js";
import { sendKafkaMessage } from "./sendKafkaMessage.js";
import { v2 as cloudinary } from 'cloudinary';

async function uploadAttachmentsToCloudinary(attachments) {
  const uploadedUrls = [];

  for (const attachment of attachments) {
    if (!attachment.content || !attachment.filename) continue;

    const base64Data = `data:${attachment.contentType};base64,${attachment.content.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      folder: "tickets",
      public_id: attachment.filename,
      resource_type: "auto"
    });

    uploadedUrls.push(uploadResult.secure_url);
  }

  return uploadedUrls;
}

async function saveTicketFromEmail(parsedEmail) {
  if (!parsedEmail) return null;

  try {
    const uploadedUrls = parsedEmail.attachments?.length
      ? await uploadAttachmentsToCloudinary(parsedEmail.attachments)
      : [];

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
      attachments: JSON.stringify(uploadedUrls) // ✅ đúng bản chất hơn
    };

    const newTicket = await Ticket.create(ticketData);

    console.log(`Ticket mới được tạo: ticketId=${newTicket.ticketId}`);

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
