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
      type: DataTypes.INTEGER,
      allowNull: true
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    html: {
      type: DataTypes.TEXT('long'), // TEXT hoặc LONGTEXT nếu nội dung lớn
      allowNull: true
    },
    attachments: {
      type: DataTypes.TEXT, // hoặc TEXT nếu bạn muốn stringify trước
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
    agentResponse:{
      type:DataTypes.TEXT,
      allowNull:true,
      defaultValue:null,
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      allowNull: false,
      defaultValue: 'open'
    }
  }, {
    tableName: 'ticket-agent',
    timestamps: true
  });
};
