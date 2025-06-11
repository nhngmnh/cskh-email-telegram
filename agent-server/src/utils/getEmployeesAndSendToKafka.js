import { producer } from "../config/kafkaConfig.js";
import { agent } from "../models/ticket-agentDB.js";
async function getEmployeesAndSendToKafka() {
  try {
    const count = await agent.count();

    await producer.send({
      topic: "update-employee",
      messages: [
        {
          value: JSON.stringify({ totalAgents: count }),
        },
      ],
    });

    return count;
  } catch (error) {
    console.error("Error sending employee count to Kafka:", error);
    return false;
  }
}

export default getEmployeesAndSendToKafka;