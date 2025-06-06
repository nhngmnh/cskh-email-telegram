
export default (sequelize, DataTypes) => {
  return sequelize.define('ticket', {
    ticketServerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assignedEmployee: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastMessageId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    receivedDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'open'
    }
  }, {
    tableName: 'ticket-agent',
    timestamps: true // Tự động thêm createdAt và updatedAt
  });
};
