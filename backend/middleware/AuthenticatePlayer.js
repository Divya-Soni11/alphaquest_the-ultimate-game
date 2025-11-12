import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
  try {
    // Try getting token from cookie
    let token = req.cookies?.token;

    //  If not found, try getting from "Authorization" header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7); // remove "Bearer "
      }
    }

    //  Still no token? → Unauthorized
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized: No token provided',
        success: false
      });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', success: false });
    }
    return res.status(403).json({ message: 'Forbidden: Invalid token', success: false });
  }
};

export default authenticateUser;
