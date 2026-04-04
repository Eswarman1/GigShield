const Policy = require('../models/Policy');
const User = require('../models/User');
const mockDb = require('../utils/mockDatabase');
const { calculateDynamicPremium } = require('../utils/calculations');

// Helper to check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};


// Get all policies for user
exports.getUserPolicies = async (req, res) => {
  try {
    let policies;

    if (isMongoConnected()) {
      policies = await Policy.find({ userId: req.userId });
    } else {
      policies = mockDb.getPoliciesByUserId(req.userId);
    }

    res.json({ success: true, policies });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching policies', error: err.message });
  }
};


// Get policy by ID
exports.getPolicyById = async (req, res) => {
  try {
    let policy;

    if (isMongoConnected()) {
      policy = await Policy.findById(req.params.id);
    } else {
      policy = mockDb.getPolicyById(req.params.id);
    }

    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }

    const userId = policy.userId ? policy.userId.toString() : policy.userId;

    if (userId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, policy });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching policy', error: err.message });
  }
};


// Create new policy
// Create new policy
exports.createPolicy = async (req, res) => {
  try {

    const {
      coverageAmount,
      waitingPeriodDays,
      deductibleAmount,
      premiumFrequency,
      startDate,
      termsAccepted
    } = req.body;

    let user;

    if (isMongoConnected()) {
      user = await User.findById(req.userId);
    } else {
      user = mockDb.findUserById(req.userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const monthlyIncome = user.monthlyAverageIncome || 3000;
    const workingHours = user.workingHoursPerWeek || 40;

    const riskFactor = 1.0;
    const volumeMultiplier = monthlyIncome > 3000 ? 1.2 : 1.0;

    const basePremium = (coverageAmount / 1000) * 15;

    const calculatedPremium = calculateDynamicPremium(
      monthlyIncome,
      workingHours,
      riskFactor,
      volumeMultiplier
    );
const weeklyIncome = (user.monthlyAverageIncome || 3000) / 4.33;
    const policyData = {
  userId: req.userId,
  weeklyIncome,
  coverageAmount,
  waitingPeriodDays,
  deductibleAmount,
  premiumFrequency,
  basePremium,
  calculatedPremium,
  startDate,
  termsAccepted,
  status: 'Pending',
  disruption: {
    riskFactors: user.deliveryPlatforms || [],
    historicalClaimRate: 0.05,
    incomeVolatility: 0.3
  }
};

    let policy;

    if (isMongoConnected()) {

      policy = new Policy(policyData);
      await policy.save();

      await User.findByIdAndUpdate(req.userId, {
        activePolicy: policy._id
      });

    } else {

      policy = mockDb.createPolicy(policyData);

    }

    res.status(201).json({
      success: true,
      message: 'Policy created successfully',
      policy,
      premiumBreakdown: {
        basePremium,
        calculatedPremium,
        frequency: premiumFrequency
      }
    });

  } catch (err) {

    console.error("Policy creation error:", err);

    res.status(500).json({
      success: false,
      message: 'Error creating policy',
      error: err.message
    });

  }
};


// Activate policy
exports.activatePolicy = async (req, res) => {
  try {

    let policy;

    if (isMongoConnected()) {
      policy = await Policy.findById(req.params.id);
    } else {
      policy = mockDb.getPolicyById(req.params.id);
    }

    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }

    const userId = policy.userId ? policy.userId.toString() : policy.userId;

    if (userId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    endDate.setFullYear(endDate.getFullYear() + 1);

    const nextPaymentDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));

    if (isMongoConnected()) {

      const updatedPolicy = await Policy.findByIdAndUpdate(
        req.params.id,
        {
          status: 'Active',
          startDate,
          endDate,
          nextPaymentDate
        },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Policy activated successfully',
        policy: updatedPolicy
      });

    } else {

      const updatedPolicy = mockDb.updatePolicy(req.params.id, {
        status: 'Active',
        startDate,
        endDate,
        nextPaymentDate
      });

      res.json({
        success: true,
        message: 'Policy activated successfully (mock DB)',
        policy: updatedPolicy
      });

    }

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error activating policy', error: err.message });
  }
};


// Cancel policy
exports.cancelPolicy = async (req, res) => {
  try {

    let policy;

    if (isMongoConnected()) {
      policy = await Policy.findById(req.params.id);
    } else {
      policy = mockDb.getPolicyById(req.params.id);
    }

    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found' });
    }

    const userId = policy.userId ? policy.userId.toString() : policy.userId;

    if (userId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (isMongoConnected()) {

      const updatedPolicy = await Policy.findByIdAndUpdate(
        req.params.id,
        { status: 'Cancelled', endDate: new Date() },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Policy cancelled successfully',
        policy: updatedPolicy
      });

    } else {

      const updatedPolicy = mockDb.updatePolicy(req.params.id, {
        status: 'Cancelled',
        endDate: new Date()
      });

      res.json({
        success: true,
        message: 'Policy cancelled successfully (mock DB)',
        policy: updatedPolicy
      });

    }

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error cancelling policy', error: err.message });
  }
};


// Recalculate premium
exports.recalculatePremium = async (req, res) => {
  try {

    let policy;
    let user;

    if (isMongoConnected()) {

      policy = await Policy.findById(req.params.id).populate('userId');

      if (!policy) {
        return res.status(404).json({ success: false, message: 'Policy not found' });
      }

      user = policy.userId;

    } else {

      policy = mockDb.getPolicyById(req.params.id);

      if (!policy) {
        return res.status(404).json({ success: false, message: 'Policy not found' });
      }

      user = mockDb.findUserById(policy.userId);

    }

    const userId = typeof user._id === 'object' ? user._id.toString() : user._id;

    if (userId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const riskFactor = 1.0;
    const volumeMultiplier = policy.weeklyIncome > 6000 ? 1.2 : 1.0;

    const newPremium = calculateDynamicPremium(
      policy.weeklyIncome,
      user.workingHoursPerWeek,
      riskFactor,
      volumeMultiplier
    );

    if (isMongoConnected()) {

      policy.calculatedPremium = newPremium;
      await policy.save();

    } else {

      policy = mockDb.updatePolicy(req.params.id, { calculatedPremium: newPremium });

    }

    res.json({
      success: true,
      message: 'Premium recalculated',
      policy,
      newPremium
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error recalculating premium', error: err.message });
  }
};