import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { throwBadRequest, throwUnauthorized } from "../utils/ApiError.js";
import { sendSuccess, sendCreated } from "../utils/apiResponse.js";

/**
 * Generate a JWT token for the user.
 * 
 * @param {string} id - User ID
 * @returns {string} - JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * @desc    Register a new security user
 * @route   POST /api/auth/register
 * @access  Public (or restricted in production)
 */
const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Validation
    if (!name || !email || !password) {
      throwBadRequest("Please provide name, email, and password registration details.");
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throwBadRequest("Registration failed. A user profile already exists with this email address.");
    }

    // 3. Create user (password is automatically hashed via schema pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || "Employee",
    });

    // 4. Generate token and return success
    const token = generateToken(user._id);
    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
    };

    return sendCreated(res, data, "User account registered successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 1. Validation
    if (!email || !password) {
      throwBadRequest("Please enter email and password credentials.");
    }

    // 2. Find user in registry
    const user = await User.findOne({ email });
    if (!user) {
      throwUnauthorized("Authentication failed. Invalid email or password credentials.");
    }

    if (user.status !== "Active") {
      throwUnauthorized("Authentication failed. User account is inactive.");
    }

    // 3. Verify password hash matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throwUnauthorized("Authentication failed. Invalid email or password credentials.");
    }

    // 4. Generate token and return success
    const token = generateToken(user._id);
    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
    };

    return sendSuccess(res, data, "Authentication successful!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Protected
 */
const getMe = async (req, res, next) => {
  try {
    // req.user has already been set by the 'protect' middleware
    return sendSuccess(res, req.user, "User profile fetched successfully!");
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getMe,
};

export {
  register,
  login,
  getMe,
};
