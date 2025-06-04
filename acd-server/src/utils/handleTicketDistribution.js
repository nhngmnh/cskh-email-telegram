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
        acdRoundRobin.roundRobinIndex = (index + 1) % totalEmployees;
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
    console.log(`Ticket ${ticket.ticketId} assigned to ${assignedEmployee.name} (ID: ${assignedEmployee.id}) (name: ${assignedEmployee.name}) with ${assignedEmployee.activeTickets}`);
    roundRobinIndex=assignedEmployee.id+1;
    await sendAcdResult('acd-result', {
  ticketId: ticket.ticketId,
  assignedTo: assignedEmployee.id,
});
    assignedEmployee.activeTickets = (assignedEmployee.activeTickets || 0) + 1;
    return true;
  } else {

    // sẽ có hàm đóng close nó ở đây để coi như status nó là closed
    console.log(`No available employee for ticket ${ticket.ticketId}`);
    return false;
  }
}
