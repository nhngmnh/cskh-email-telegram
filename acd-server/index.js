import express from 'express'
const app = express();
import dotenv from 'dotenv'

dotenv.config();
import startAcdConsumer from './src/service/acdConsumer.js';
startAcdConsumer();