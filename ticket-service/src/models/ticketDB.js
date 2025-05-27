import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/sequalize.js'; // hoặc './db.js' nếu bạn để chung
import TicketDistributionModel from './ticketDistribution.js';
import TicketMessageModel from './ticketMessage.js';

// Khởi tạo model
const TicketDistribution = TicketDistributionModel(sequelize, DataTypes);
const TicketMessage = TicketMessageModel(sequelize, DataTypes);

// Thiết lập mối quan hệ
TicketDistribution.hasOne(TicketMessage, {
  foreignKey: 'ticketId',
  sourceKey: 'ticketId',
  as: 'message'
});

TicketMessage.belongsTo(TicketDistribution, {
  foreignKey: 'ticketId',
  targetKey: 'ticketId',
  as: 'distribution'
});

// Xuất models và sequelize
export {
  sequelize,
  TicketDistribution,
  TicketMessage
};
