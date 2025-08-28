// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

// Verify JWT and attach user info to request
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      console.warn("🚨 No Authorization header provided");
      return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
    if (!token) {
      console.warn("🚨 Malformed Authorization header:", authHeader);
      return res.status(403).json({ message: "Token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("🚨 JWT verification failed:", err.message);
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      // Attach decoded values for downstream use
      req.userId = decoded.id;
      req.userRole = decoded.role;

      console.log(`✅ Authenticated request by user ${decoded.id} (${decoded.role})`);
      next();
    });
  } catch (err) {
    console.error("🚨 Error in verifyToken:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check admin role
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    console.warn(`🚨 Access denied for user ${req.userId} (${req.userRole})`);
    return res.status(403).json({ message: "Require admin role" });
  }
  next();
};
