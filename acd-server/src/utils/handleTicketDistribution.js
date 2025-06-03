export async function handleTicketDistribution(ticket) {
  console.log(ticket.ticketId);
  
    const ignored = ticket.ignoredEmployees?ticket.ignoredEmployees:[]
  // Giả sử danh sách toàn cục:
  const employeeList = global?.employeeList || [];
  
  const available = employeeList.filter(e => !ignored.includes(e));
  const assignedEmployee = available[0] || null;

  if (assignedEmployee) {
    console.log(`Ticket ${ticket.ticketId} assigned to ${assignedEmployee}`);
    // TODO: gửi Telegram hoặc cập nhật DB qua API, tuỳ logic của bạn
  } else {
    console.log(`No available employee for ticket ${ticket.ticketId}`);
  }
}