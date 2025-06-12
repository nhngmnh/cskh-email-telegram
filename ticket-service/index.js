import express from 'express';
import dotenv from 'dotenv';
import connectCloudinary from './src/config/cloudinary.js';
import connectDB from './src/config/connectDB.js';
import { initKafkaProducer, initKafkaConsumer } from './src/config/kafkaConfig.js';
import { startTicketConsumer } from './src/services/ticketConsumer.js';
import ticketRouter from './routes/ticketRouter.js';
import cors from 'cors'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectCloudinary();

async function startApp() {
  try {
    await connectDB();
    app.get('/', (req, res) => {
      res.send('Server is running');
    });

    app.listen(PORT, () => {
      console.log(`[Startup] Server is running on port ${PORT}`);
    });
    app.use('/api',ticketRouter);
    await Promise.all([
      initKafkaProducer(),
      initKafkaConsumer()
    ]);
    await startTicketConsumer();

    
  } catch (err) {
    console.error('[Startup] Error:', err);
    process.exit(1);
  }
}
startApp();
