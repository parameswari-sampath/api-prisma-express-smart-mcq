/**
 * Authentication middleware
 */
const { verifyToken } = require("../utils/jwt.util");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Middleware to authenticate requests using JWT
 * Adds the authenticated user to req.user if token is valid
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Find user by id
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

module.exports = {
  authenticate,
};
