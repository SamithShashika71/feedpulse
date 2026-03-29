const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Validation Error',
        message: 'Email and password are required',
      });
    }

    // Find admin user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Unauthorized',
        message: 'Invalid email or password',
      });
    }

    // Return token
    res.status(200).json({
      success: true,
      data: {
        token: generateToken(user._id, user.email),
        email: user.email,
      },
      error: null,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

// @route   POST /api/auth/setup
// @access  Public (only used once to create admin)
const setup = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Bad Request',
        message: 'Admin already exists',
      });
    }

    const admin = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    res.status(201).json({
      success: true,
      data: { email: admin.email },
      error: null,
      message: 'Admin created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: 'Server Error',
      message: error.message,
    });
  }
};

module.exports = { login, setup };