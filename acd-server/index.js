import express from 'express'
const app = express();
import dotenv from 'dotenv'

dotenv.config();
import startAcdConsumer from './src/service/acdConsumer.js';
global.employeeList = ['emp1', 'emp2', 'emp3'];

startAcdConsumer();