// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import startAgentConsumer from './src/services/agentConsumer.js';
import connectDB from './src/config/connectDB.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

global.agentAssignments = []; // Lưu lịch sử phân phối tạm thời trong RAM
await connectDB();
// Khởi động server và consumer
app.listen(PORT, () => {
  console.log(`Agent server running on port ${PORT}`);
  startAgentConsumer();
});
