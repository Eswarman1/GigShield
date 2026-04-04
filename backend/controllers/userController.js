const User = require('../models/User');
const mockDb = require('../utils/mockDatabase');

// Helper to check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    let user;
    
    if (isMongoConnected()) {
      user = await User.findById(req.userId).select('-password');
    } else {
      user = mockDb.findUserById(req.userId);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching profile', error: err.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, deliveryPlatforms, monthlyAverageIncome, workingHoursPerWeek, bankAccountNumber, bankRoutingNumber } = req.body;

    const updatedData = {
      firstName,
      lastName,
      phone,
      deliveryPlatforms,
      monthlyAverageIncome,
      workingHoursPerWeek,
      bankAccountNumber,
      bankRoutingNumber,
    };

    let user;
    
    if (isMongoConnected()) {
      user = await User.findByIdAndUpdate(req.userId, updatedData, { new: true }).select('-password');
    } else {
      user = mockDb.updateUser(req.userId, updatedData);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    }
    
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating profile', error: err.message });
  }
};

// Verify user identity
exports.verifyIdentity = async (req, res) => {
  try {
    let user;
    
    if (isMongoConnected()) {
      user = await User.findByIdAndUpdate(req.userId, { identityVerified: true }, { new: true });
    } else {
      user = mockDb.updateUser(req.userId, { identityVerified: true });
    }
    
    res.json({ success: true, message: 'Identity verified successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error verifying identity', error: err.message });
  }
};

// Verify documents
exports.verifyDocuments = async (req, res) => {
  try {
    let user;
    
    if (isMongoConnected()) {
      user = await User.findByIdAndUpdate(req.userId, { documentVerified: true }, { new: true });
    } else {
      user = mockDb.updateUser(req.userId, { documentVerified: true });
    }
    
    res.json({ success: true, message: 'Documents verified successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error verifying documents', error: err.message });
  }
};
