import express from 'express'
import { acdRoundRobin } from '../config/agentConfig.js';

const acdRouter = express.Router();

acdRouter.get('/get-strategy', (req, res) => {
  return res.json({ strategy: acdRoundRobin.strategy });
});

acdRouter.post('/set-strategy', (req, res) => {
  const { strategy } = req.body;
  const allowed = ['round-robin', 'random','least-tickets']; 
  if (!allowed.includes(strategy)) {
    return res.json({ success:false, error: 'Invalid strategy' });
  }
  global.strategy = strategy;
  return res.json({ success: true, strategy });
});

export default acdRouter;