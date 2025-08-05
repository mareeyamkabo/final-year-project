// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// ✅ Verify token middleware
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Replace with env var in prod
    req.user = decoded;
    next(); // Move to next middleware or controller
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// middleware/authMiddleware.js
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};

