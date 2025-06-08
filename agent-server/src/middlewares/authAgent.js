import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Lấy header
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Token không được cung cấp.' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ.' });

    // Gán id vào req.body.id
    req.body.id = payload.id;

    next();
  });
};

export default authenticateToken;
