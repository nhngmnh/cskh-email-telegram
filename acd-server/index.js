import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
const app = express();
dotenv.config();
import bodyParser from 'body-parser';
import startAcdConsumer from './src/service/acdConsumer.js';
import acdRouter from './src/routes/acdRouter.js';

global.employeeList = [
  { id: 1, name: 'Alice', activeTickets: 0 },
  { id: 2, name: 'Bob', activeTickets: 0 },
  { id: 3, name: 'Charlie', activeTickets: 0 },
  { id: 4, name: 'David', activeTickets: 0 },
  { id: 5, name: 'Eva', activeTickets: 0 }
];

global.totalEmployees = global.employeeList.length;
global.strategy= 'round-robin'
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', acdRouter);
app.get('/',(req, res) => { res.send("api working")});
app.listen(3001, () => console.log('ACD server GUI on port 3001'));
startAcdConsumer();