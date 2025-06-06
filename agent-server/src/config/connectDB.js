import { sequelize } from '../models/ticket-agentDB.js'

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;  
  }
}

export default connectDB;