const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');
const mockDb = require('../utils/mockDatabase');
const bcrypt = require('bcryptjs');

// Helper to check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// User Registration
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone, deliveryPlatforms, monthlyAverageIncome, workingHoursPerWeek } = req.body;

    // Check if user exists
    let user;
    
    if (isMongoConnected()) {
      // Use MongoDB
      user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      user = new User({
        firstName,
        lastName,
        email,
        password,
        phone,
        deliveryPlatforms,
        monthlyAverageIncome,
        workingHoursPerWeek,
      });

      await user.save();
    } else {
      // Use mock database
      user = mockDb.findUserByEmail(email);
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      user = mockDb.createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        deliveryPlatforms,
        monthlyAverageIncome: parseFloat(monthlyAverageIncome) || 0,
        workingHoursPerWeek: parseFloat(workingHoursPerWeek) || 0,
        bankAccountNumber: '',
        bankRoutingNumber: '',
        documentVerified: false,
        identityVerified: false,
        activePolicy: null,
      });
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Error in registration', error: err.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    let user;
    
    if (isMongoConnected()) {
      // Use MongoDB
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      // Use mock database
      user = mockDb.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Error in login', error: err.message });
  }
};

// Me - Get current user
exports.me = async (req, res) => {
  try {
    let user;
    
    if (isMongoConnected()) {
      // Use MongoDB
      user = await User.findById(req.userId).select('-password');
    } else {
      // Use mock database
      user = mockDb.findUserById(req.userId);
      if (user) {
        // Return copy without password
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ success: false, message: 'Error fetching user', error: err.message });
  }
};
