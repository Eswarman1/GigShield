const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const User = require('../models/User');
const mockDb = require('../utils/mockDatabase');
const { calculateClaimPayout, detectDisruption } = require('../utils/calculations');

// Helper to check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Get all claims for user
exports.getUserClaims = async (req, res) => {
  try {
    let claims;
    
    if (isMongoConnected()) {
      claims = await Claim.find({ userId: req.userId });
    } else {
      claims = mockDb.getClaimsByUserId(req.userId);
    }
    
    res.json({ success: true, claims });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching claims', error: err.message });
  }
};

// Get claim by ID
exports.getClaimById = async (req, res) => {
  try {
    let claim;
    
    if (isMongoConnected()) {
      claim = await Claim.findById(req.params.id);
    } else {
      claim = mockDb.getClaimById(req.params.id);
    }
    
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    const userId = claim.userId ? claim.userId.toString() : claim.userId;
    if (userId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, claim });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching claim', error: err.message });
  }
};

// Submit new claim
exports.submitClaim = async (req, res) => {
  try {
    const {
  claimType,
  disruptionReason,
  incomeBeforeDisruption,
  estimatedIncomeLoss,
  disruptionStartDate,
  disruptionEndDate
} = req.body;

const incomeAfterDisruption =
  incomeBeforeDisruption - estimatedIncomeLoss;
    // VALIDATION

if (estimatedIncomeLoss > incomeBeforeDisruption) {
  return res.status(400).json({
    success:false,
    message:"Estimated income loss cannot be greater than income before disruption"
  });
}

if (incomeBeforeDisruption <= 0 || estimatedIncomeLoss <= 0) {
  return res.status(400).json({
    success:false,
    message:"Income values must be positive numbers"
  });
}
if (estimatedIncomeLoss / incomeBeforeDisruption > 0.9) {
  console.log("High risk claim flagged for manual review");
}


// const startDate = new Date(disruptionStartDate);
// const endDate = new Date(disruptionEndDate);

if (endDate < startDate) {
  return res.status(400).json({
    success: false,
    message: "End date cannot be before start date"
  });
}


    // Get user's active policy
    let user;
    let policy;
    
    if (isMongoConnected()) {
      user = await User.findById(req.userId);
      policy = await Policy.findById(user.activePolicy);
    } else {
      user = mockDb.findUserById(req.userId);
      if (user && user.activePolicy) {
        policy = mockDb.getPolicyById(user.activePolicy);
      }
    }

    if (!policy) {
      return res.status(400).json({ success: false, message: 'User does not have an active policy' });
    }

    if (policy.status !== 'Active') {
      return res.status(400).json({ success: false, message: 'Policy is not active' });
    }

    // Check waiting period
    const daysSinceStart = Math.floor((Date.now() - new Date(policy.startDate)) / (1000 * 60 * 60 * 24));
    if (daysSinceStart < policy.waitingPeriodDays) {
      return res.status(400).json({
        success: false,
        message: `Waiting period not met. Days remaining: ${policy.waitingPeriodDays - daysSinceStart}`,
      });
    }

    // Calculate claim amount
    const startDate = new Date(disruptionStartDate);
    const endDate = new Date(disruptionEndDate);
    const daysDisrupted = Math.max(
  1,
  Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
);
// update Check if disruption actually happened
const currentIncome = incomeBeforeDisruption - estimatedIncomeLoss;
const disruptedObj = detectDisruption(currentIncome, incomeBeforeDisruption); 
if (!disruptedObj.disrupted) {
  return res.status(400).json({
    success: false,
    message: "Income disruption not significant enough for claim"
  });
}

//
    const claimAmount = calculateClaimPayout(
      incomeBeforeDisruption,
      estimatedIncomeLoss,
      daysDisrupted,
      policy.coverageAmount
    );

    const finalClaimAmount = Math.max(0, claimAmount - policy.deductibleAmount);

    const claimData = {
  userId: req.userId,
  policyId: policy._id,
  claimType,
  disruptionType: disruptionReason,
  incomeBeforeDisruption,
  incomeAfterDisruption,
  estimatedIncomeLoss,
  disruptionStartDate,
  disruptionEndDate,
  claimAmount: finalClaimAmount,
  status: "Submitted"
};
// if (!req.body.policyId) {
//   return res.status(400).json({
//     success:false,
//     message:"Policy ID required"
//   });
// }
    let claim;
    if (isMongoConnected()) {
      claim = new Claim(claimData);
      await claim.save();
    } else {
      claim = mockDb.createClaim(claimData);
    }

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully',
      claim,
      claimDetails: {
        daysDisrupted,
        incomeBeforeDeductible: claimAmount,
        deductible: policy.deductibleAmount,
        finalClaimAmount,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error submitting claim', error: err.message });
  }
};

// Update claim status (Admin functionality)
exports.updateClaimStatus = async (req, res) => {
  try {
    const { status, reviewerNotes, approvalDate, paymentDate, rejectionReason } = req.body;
    
    let claim;
    if (isMongoConnected()) {
      claim = await Claim.findById(req.params.id);
    } else {
      claim = mockDb.getClaimById(req.params.id);
    }

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    const userId = claim.userId ? claim.userId.toString() : claim.userId;
    if (userId !== req.userId && req.body.adminUpdate !== true) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updateData = {
      status,
      reviewerNotes,
      approvalDate: status === 'Approved' ? approvalDate || new Date() : null,
      paymentDate: status === 'Paid' ? paymentDate || new Date() : null,
      rejectionReason: status === 'Rejected' ? rejectionReason : null,
    };

    if (isMongoConnected()) {
      const updatedClaim = await Claim.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.json({
        success: true,
        message: 'Claim status updated',
        claim: updatedClaim,
      });
    } else {
      const updatedClaim = mockDb.updateClaim(req.params.id, updateData);
      res.json({
        success: true,
        message: 'Claim status updated (mock DB)',
        claim: updatedClaim,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating claim', error: err.message });
  }
};

// Withdraw claim
exports.withdrawClaim = async (req, res) => {
  try {
    let claim;
    
    if (isMongoConnected()) {
      claim = await Claim.findById(req.params.id);
    } else {
      claim = mockDb.getClaimById(req.params.id);
    }
    
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    const userId = claim.userId ? claim.userId.toString() : claim.userId;
    if (userId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['Approved', 'Paid'].includes(claim.status)) {
      return res.status(400).json({ success: false, message: 'Cannot withdraw approved or paid claims' });
    }

    if (isMongoConnected()) {
      const updatedClaim = await Claim.findByIdAndUpdate(
        req.params.id,
        { status: 'Rejected', rejectionReason: 'Withdrawn by user' },
        { new: true }
      );
      res.json({
        success: true,
        message: 'Claim withdrawn successfully',
        claim: updatedClaim,
      });
    } else {
      const updatedClaim = mockDb.updateClaim(req.params.id, {
        status: 'Rejected',
        rejectionReason: 'Withdrawn by user',
      });
      res.json({
        success: true,
        message: 'Claim withdrawn successfully (mock DB)',
        claim: updatedClaim,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error withdrawing claim', error: err.message });
  }
};
//update
// Check for income disruption (Real-time data simulation)
// Check disruption (simulation for parametric trigger)
exports.checkDisruption = async (req, res) => {
  try {

    const { currentWeeklyIncome } = req.body;

    let user;

    if (isMongoConnected()) {
      user = await User.findById(req.userId);
    } else {
      user = mockDb.findUserById(req.userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const { disrupted, expectedWeeklyIncome, disruptionPercentage } = detectDisruption(
  currentWeeklyIncome,
  user.monthlyAverageIncome / 4.33
);

res.json({
  success: true,
  disrupted,
  currentWeeklyIncome,
  expectedWeeklyIncome: expectedWeeklyIncome.toFixed(2),
  disruptionPercentage
});

    

    

  } catch (err) {
  console.error("Claim creation error:", err);

  res.status(500).json({
    success:false,
    message:"Error creating claim",
    error:err.message
  });
}};//