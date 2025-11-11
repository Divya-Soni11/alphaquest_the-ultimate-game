import jwt from 'jsonwebtoken';

const authenticateUserFromCookie = (req, res, next) => {
  const token = req.cookies.token; // read token from cookie

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - no token", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden - invalid token", success: false });
  }
};

export default authenticateUserFromCookie;