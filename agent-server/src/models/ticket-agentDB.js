import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js'; // đúng đường dẫn config DB

import TicketAgentModel from './ticket-agent.js';
import AgentModel from './agent.js';

// Khởi tạo model
const ticket_agent = TicketAgentModel(sequelize, DataTypes);
const agent = AgentModel(sequelize, DataTypes);

// Thiết lập quan hệ: 1 agent -> nhiều ticket
agent.hasMany(ticket_agent, {
  foreignKey: 'assignedEmployee',
  sourceKey: 'id' 
});
ticket_agent.belongsTo(agent, {
  foreignKey: 'assignedEmployee',
  targetKey: 'id'
});

// Export tất cả
export {
  sequelize,
  ticket_agent,
  agent
};
