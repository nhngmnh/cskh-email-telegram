export default (sequelize, DataTypes) => {
  return sequelize.define('ticketDistribution', {
    ticketId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    messageId: {
      type: DataTypes.STRING,
      allowNull: false,
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
    previousTicketId: {
      type: DataTypes.INTEGER,
      allowNull: true
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
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'ticketDistribution',
    timestamps: false
  });
};
