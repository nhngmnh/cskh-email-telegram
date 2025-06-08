export default (sequelize, DataTypes) => {
  return sequelize.define('ticket', {
    ticketId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
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
    ignoredEmployees: {
      type: DataTypes.JSON, // mảng các nhân viên đã ignore
      allowNull: false,
      defaultValue: []
    },
    html: {
      type: DataTypes.TEXT('long'), // nội dung email HTML
      allowNull: true
    },
    attachments: {
      type: DataTypes.TEXT, // sẽ dùng JSON.stringify trước khi lưu
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
      type: DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'open'
    }
  }, {
    tableName: 'ticket',
    timestamps: true
  });
};
