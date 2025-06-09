import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      message: 'Token không được cung cấp.',
    });
  }

  if (!JWT_SECRET) {
    console.error('JWT_SECRET không được cấu hình trong .env');
    return res.status(500).json({ message: 'Lỗi máy chủ: thiếu JWT_SECRET' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: 'Token không hợp lệ.' });
    }
    req.body = {
      ...req.body,        // giữ lại dữ liệu gốc từ client
      agentId: payload.id // ghi đè hoặc thêm field agentId
    };

    next();
  });
};

export default authenticateToken;
