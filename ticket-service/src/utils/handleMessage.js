import { simpleParser } from "mailparser";
import { saveTicketFromEmail } from "../services/emailProccessor.js";
const handleIncomingEmails = async (data)=>{
    if ( !data || !data.raw) {
            return null;
        }
        
         try {
    const parsed = await simpleParser(data.raw);
            console.log(parsed.text);
            
    const parsedTicket= {
      from: parsed.from?.text || null,
      to: parsed.to?.text || null,
      subject: parsed.subject || null,
      body: parsed.text || parsed.html || null,
      attachments: parsed.attachments?.map(att => att.filename) || [],
      date: parsed.date || null,
      messageId: parsed.messageId || null,
      replyTo:parsed.inReplyTo || null
    };
    await saveTicketFromEmail(parsedTicket)
  } catch {
    return null; // Bỏ qua email lỗi
  }
        
}
export {
    handleIncomingEmails
}