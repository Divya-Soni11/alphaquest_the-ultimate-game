import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify JWT token from HTTP-only cookie.
 * If token is valid, attaches decoded user info to req.user and calls next().
 * Otherwise, responds with 401 or 403 errors.
 */
const authenticateUserFromCookie = (req, res, next) => {
  try {
    // Read token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided", success: false });
    }

    // Verify token with JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded info to request object for downstream use
    req.user = decoded;

    // Proceed to next middleware/route handler
    next();

  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired", success: false });
    }
    return res.status(403).json({ message: "Forbidden: Invalid token", success: false });
  }
};

export default authenticateUserFromCookie;
