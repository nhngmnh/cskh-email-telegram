import { acdRoundRobin } from "../config/agentConfig.js";
import { sendAcdResult } from "./kafkaProducer.js";

export async function handleTicketDistribution(ticket) {
  const {  roundRobinIndex } = acdRoundRobin;
  const strategy= global.strategy || 'round-robin'
  const employeeList = global.employeeList || [];
  const totalEmployees = global.totalEmployees || 0;
  const ignored = ticket.ignoredEmployees ?? [];

  let assignedEmployee = null;

  if (strategy === 'round-robin') {
    let i = 0;
    while (i < totalEmployees) {
      const index = (roundRobinIndex + i) % totalEmployees;
      const candidate = employeeList[index];
      if (!ignored.includes(candidate.id)) {
        assignedEmployee = candidate;
        break;
      }
      i++;
    }

  } else if (strategy === 'random') {
    const availableEmployees = employeeList.filter(e => !ignored.includes(e.id));
    if (availableEmployees.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableEmployees.length);
      assignedEmployee = availableEmployees[randomIndex];
      
    }

  } else if (strategy === 'least-tickets') {
    const available = employeeList.filter(e => !ignored.includes(e.id));
    if (available.length > 0) {
      assignedEmployee = available.reduce((minEmp, currEmp) =>
        currEmp.activeTickets < minEmp.activeTickets ? currEmp : minEmp
      );
    }
    
  } else {
    console.warn(`Unknown strategy: ${strategy}`);
  }

if (assignedEmployee) {
  console.log(`Ticket ${ticket.ticketId} assigned to ${assignedEmployee.name} (ID: ${assignedEmployee.id}) with ${assignedEmployee.activeTickets}`);
  acdRoundRobin.roundRobinIndex = (acdRoundRobin.roundRobinIndex + 1) % totalEmployees;
  await sendAcdResult('acd-result', {
    type: 'distribution_result',
    ticketId: ticket.ticketId,
    assignedTo: assignedEmployee.id,
  });
  assignedEmployee.activeTickets = (assignedEmployee.activeTickets || 0) + 1;
  return true;
} else {
  console.log(`No available employee for ticket ${ticket.ticketId}`);
  await sendAcdResult('acd-result', {
    type: 'close_ticket',
    ticketId: ticket.ticketId,
  });
  return false;
}
}
