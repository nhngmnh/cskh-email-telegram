import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
const app = express();
dotenv.config();
import bodyParser from 'body-parser';
import startAcdConsumer from './src/service/acdConsumer.js';
import acdRouter from './src/routes/acdRouter.js';

global.employeeList = [
];

global.totalEmployees = global.employeeList.length;
global.strategy= 'round-robin';
function resetActiveTickets() {
  global.employeeList.forEach(emp => {
    emp.activeTickets = 0;
  });
  console.log(`[${new Date().toISOString()}] Reset tất cả activeTickets về 0.`);
}

// Đặt lịch chạy mỗi 24h
setInterval(resetActiveTickets, 24 * 60 * 60 * 1000);

resetActiveTickets();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', acdRouter);
app.get('/',(req, res) => { res.send("api working")});
app.listen(3001, () => console.log('ACD server GUI on port 3001'));
startAcdConsumer();