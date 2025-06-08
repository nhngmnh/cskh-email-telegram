import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { agent } from '../models/ticket-agentDB.js';
import dotenv from 'dotenv'
import axios from 'axios';
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
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đăng nhập.' });
    }

    const existingAgent = await agent.findOne({ where: { username } });
    if (!existingAgent) {
      return res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }

    const match = await bcrypt.compare(password, existingAgent.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' });
    }

    const accessToken = jwt.sign(
      { id: existingAgent.id, username: existingAgent.username },
      JWT_SECRET,
    );

    const { password: _, ...agentInfo } = existingAgent.toJSON();

    return res.json({ success: true, token:accessToken });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi server.' });
  }
});
const EMAIL_GATEWAY_API = process.env.EMAIL_GATEWAY_API; 
agentRouter.get('/open-ticket', async (req, res) => {
  try {
    const {lastMessageId, to} = req.query;

    // Gọi API email-gateway tạo ticket
    console.log(EMAIL_GATEWAY_API);
    
   const response = await axios.get(`${EMAIL_GATEWAY_API}/emails/content`, {
  params: {
    lastMessageId: lastMessageId,
    to: to
  }
});


    // Trả về kết quả từ email-gateway
    res.status(201).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Lỗi mở ticket:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi mở ticket qua email-gateway.'
    });
  }
});
export default agentRouter;
