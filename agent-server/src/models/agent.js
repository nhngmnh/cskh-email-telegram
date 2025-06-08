export default (sequelize, DataTypes) => {
  return sequelize.define('agent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phoneNumber:{
      type: DataTypes.STRING(255),
      allowNull: true  
    }
  }, {
    tableName: 'agent',
    timestamps: true // Thêm createdAt và updatedAt
  });
};