// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import startAgentConsumer from './src/services/agentConsumer.js';
import connectDB from './src/config/connectDB.js';
import agentRouter from './src/routes/agentRouter.js';
import connectCloudinary from './src/config/cloudinary.js';
import { producer } from './src/config/kafkaConfig.js';
import getEmployeesAndSendToKafka from './src/utils/getEmployeesAndSendToKafka.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
await connectDB();
connectCloudinary();
await producer.connect();
await getEmployeesAndSendToKafka();
// Khởi động server và consumer
app.use('/',agentRouter)
app.listen(PORT, () => {
  console.log(`Agent server running on port ${PORT}`);
  startAgentConsumer();
});
