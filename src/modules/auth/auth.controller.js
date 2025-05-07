/**
 * Authentication controller
 */
const authService = require("./auth.service");

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await authService.register(userData);

    res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = await authService.getProfile(req.user.id);

    res.status(200).json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
