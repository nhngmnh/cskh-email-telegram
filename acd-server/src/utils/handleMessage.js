import { acdRoundRobin } from "../config/agentConfig.js";
import { sendAcdResult } from "./kafkaProducer.js";

export async function handleTicketDistribution(ticket) {
  const { roundRobinIndex } = acdRoundRobin;
  const strategy = global.strategy || 'round-robin';
  const employeeList = global.employeeList || [];
  const totalEmployees = global.totalEmployees || 0;
  const ignored = ticket.ignoredEmployees ?? [];

  if (ignored.length >= totalEmployees) {
    console.log(`[ACD] Tất cả agent đều bị ignore, không thể phân phối ticket ${ticket.ticketId}`);
    await sendAcdResult('acd-result', {
      type: 'close_ticket',
      ticketId: ticket.ticketId,
    });
    return false;
  }

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
    let tries = 0;
    while (tries < 10) {
      const randomIndex = Math.floor(Math.random() * totalEmployees);
      const candidate = employeeList[randomIndex];
      if (!ignored.includes(candidate.id)) {
        assignedEmployee = candidate;
        break;
      }
      tries++;
    }

  } else if (strategy === 'least-tickets') {
    const sorted = employeeList
      .filter(e => !ignored.includes(e.id))
      .sort((a, b) => a.activeTickets - b.activeTickets);

    if (sorted.length > 0) {
      assignedEmployee = sorted[0];
    }

  } else {
    console.warn(`Unknown strategy: ${strategy}`);
  }

  if (assignedEmployee) {
    console.log(`Ticket ${ticket.ticketId} assigned to (ID: ${assignedEmployee.id}) with ${assignedEmployee.activeTickets}`);
    await sendAcdResult('acd-result', {
      type: 'distribution_result',
      ticketId: ticket.ticketId,
      assignedTo: assignedEmployee.id,
    });
    assignedEmployee.activeTickets = (assignedEmployee.activeTickets || 0) + 1;
    return true;
  } else {
    console.log(`Không tìm được agent phù hợp cho ticket ${ticket.ticketId}`);
    await sendAcdResult('acd-result', {
      type: 'close_ticket',
      ticketId: ticket.ticketId,
    });
    return false;
  }
}
export async function handleUpdateEmployee(parsed) {
  try {
    const { totalAgents } = parsed;
    console.log(parsed);
    
    const currentCount = global.employeeList.length;

    if (totalAgents > currentCount) {
      const missing = totalAgents - currentCount;

      // Lấy maxId từ phần tử cuối nếu có, ngược lại là 0
      const lastAgent = global.employeeList[global.employeeList.length - 1];
      const maxId = lastAgent ? lastAgent.id : 0;

      for (let i = 1; i <= missing; i++) {
        const newAgent = {
          id: maxId + i,
          activeTickets: 0,
        };

        global.employeeList.push(newAgent);
      }

      console.log(`[ACD] Bổ sung ${missing} agent mới. Tổng: ${global.employeeList.length}`);
    } else {
      console.log(`[ACD] Không có thay đổi về số lượng agent.`);
    }

    global.totalEmployees = global.employeeList.length;
  } catch (err) {
    console.error('[ACD] Lỗi khi xử lý update-employee:', err);
  }
}
