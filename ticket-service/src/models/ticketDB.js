import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js'; // đúng đường dẫn config DB
import TicketModel from './ticket.js';

// Khởi tạo model TicketDistribution
const ticket = TicketModel(sequelize, DataTypes);

// Xuất ra để dùng nơi khác
export {
  sequelize,
  ticket
};
