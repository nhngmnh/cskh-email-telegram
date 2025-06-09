import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { agent } from '../models/ticket-agentDB.js';
import dotenv from 'dotenv'
import axios from 'axios';
import authenticateToken from '../middlewares/authAgent.js';
import {getAgentInfo, getAgentTicketById} from '../controllers/ticketAgentController.js';
dotenv.config()
const agentRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

// Đăng ký
agentRouter.post('/register', async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đăng ký.' });
    }

    const existing = await agent.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username đã tồn tại.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgent = await agent.create({
      name,
      username,
      password: hashedPassword
    });

    // Tạo access token
    const token = jwt.sign(
      { id: newAgent.id, username: newAgent.username },
      JWT_SECRET,
    );

    const { password: _, ...agentInfo } = newAgent.toJSON();

    return res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Đăng ký lỗi:', error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
});

// Đăng nhập
agentRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ success: false, message: 'Thiếu thông tin đăng nhập.' });
    }

    const existingAgent = await agent.findOne({ where: { username } });
    if (!existingAgent) {
      return res.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }

    const match = await bcrypt.compare(password, existingAgent.password);
    if (!match) {
      return res.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }

    const accessToken = jwt.sign(
      { id: existingAgent.id, username: existingAgent.username },
      JWT_SECRET,
    );

    const { password: _, ...agentInfo } = existingAgent.toJSON();

    return res.json({ success: true, token:accessToken });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
});
const EMAIL_GATEWAY_API = process.env.EMAIL_GATEWAY_API; 

agentRouter.get('/ticket-data',authenticateToken,getAgentTicketById);
agentRouter.get('/agent-info',authenticateToken,getAgentInfo);
export default agentRouter;
