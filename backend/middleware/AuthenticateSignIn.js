import playerSignup from '../schema/SignupSchema.js';
import bcrypt from 'bcryptjs';

const authenticateUser = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        message: "Enter complete details before signing in!",
        success: false,
      });
    }

    const user = await playerSignup.findOne({ userName });
    
    if (!user) {
      return res.status(404).json({
        message: "We couldn't find you in signed up players! Sign up first!",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Incorrect password!",
        success: false,
      });
    }

    // Attach user object to request for downstream handlers to use if needed
    req.user = user;

    // Continue to next middleware or route handler
    next();

  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      message: "Internal server error!",
      success: false,
    });
  }
};

export default authenticateUser;