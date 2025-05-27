export default (sequelize, DataTypes) => {
  return sequelize.define('ticketMessage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    incomingMessage: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    responseMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'ticketMessage',
    timestamps: false
  });
};
