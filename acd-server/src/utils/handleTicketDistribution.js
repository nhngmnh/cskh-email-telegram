import { acdRoundRobin } from "../config/agentConfig.js";

export async function handleTicketDistribution(ticket) {
  const { employeeList, totalEmployees } = acdRoundRobin;
  const ignored = ticket.ignoredEmployees ?? [];

  let i = 0;
  while (i < totalEmployees) {
    const index = (acdRoundRobin.roundRobinIndex + i) % totalEmployees;
    if (!ignored.includes(employeeList[index])) break;
    i++;
  }

  let assignedEmployee = null;
  if (i < totalEmployees) {
    const index = (acdRoundRobin.roundRobinIndex + i) % totalEmployees;
    assignedEmployee = employeeList[index];
    
    acdRoundRobin.roundRobinIndex = (index + 1) % totalEmployees;
  }

  if (assignedEmployee) {
    console.log(`Ticket ${ticket.ticketId} assigned to ${assignedEmployee}`);
  } else {
    console.log(`No available employee for ticket ${ticket.ticketId}`);
  }
}
