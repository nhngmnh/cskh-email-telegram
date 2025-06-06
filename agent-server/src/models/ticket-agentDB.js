import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js'; // đúng đường dẫn config DB
import TicketAgentModel from './ticket-agent.js';

// Khởi tạo model TicketDistribution
const ticket = TicketAgentModel(sequelize, DataTypes);

// Xuất ra để dùng nơi khác
export {
  sequelize,
  ticket
};
