import { simpleParser } from "mailparser";

const handleIncomingEmails = async (data)=>{
    if ( !data || !data.raw) {
            return null;
        }
        
         try {
    const parsed = await simpleParser(data.raw);
            console.log(parsed.text);
            
    return {
      from: parsed.from?.text || null,
      to: parsed.to?.text || null,
      subject: parsed.subject || null,
      body: parsed.text || parsed.html || null,
      attachments: parsed.attachments?.map(att => att.filename) || [],
      date: parsed.date || null,
      messageId: parsed.messageId || null
    };
  } catch {
    return null; // Bỏ qua email lỗi
  }
        
}
export {
    handleIncomingEmails
}