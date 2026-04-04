const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({

  claimNumber: {
    type: String,
    unique: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true,
  },

  // Hackathon rule: ONLY income loss claims allowed
  claimType: {
    type: String,
    enum: ['Income Loss'],
    default: 'Income Loss',
  },

  // Parametric disruption trigger
  disruptionType: {
  type: String,
  default: 'Rain'
},

  // Worker income details
  incomeBeforeDisruption: {
    type: Number,
    required: true,
  },

  incomeAfterDisruption: {
    type: Number,
    // required: true,
  },

  estimatedIncomeLoss: {
    type: Number,
  },

  disruptionStartDate: {
    type: Date,
    required: true,
  },

  disruptionEndDate: {
    type: Date,
    required: true,
  },

  // Final payout after calculation
  claimAmount: {
    type: Number,
  },

  // Fraud detection fields
  location: {
    latitude: Number,
    longitude: Number,
  },

  deviceId: {
    type: String,
  },

  fraudScore: {
    type: Number,
    default: 0,
  },

  isFlagged: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Paid'],
    default: 'Submitted',
  },

  reviewerNotes: String,
  approvalDate: Date,
  paymentDate: Date,
  rejectionReason: String,

}, { timestamps: true });


// Auto-generate claim number
claimSchema.pre('save', async function(next) {
  if (!this.claimNumber) {
    const count = await mongoose.model('Claim').countDocuments();
    this.claimNumber = `CLAIM-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Claim', claimSchema);