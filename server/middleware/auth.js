import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_wedding_key_2026';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

export const requireRole = (role, audience) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  // Verify token with specific audience to ensure cross-portal token usage is blocked
  jwt.verify(token, JWT_SECRET, { audience, issuer: 'weddingalbums.in' }, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(403).json({ error: 'Invalid token or wrong portal' });
    }
    
    // Check role strictly
    if (decoded.role !== role && decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    req.user = decoded;
    next();
  });
};
