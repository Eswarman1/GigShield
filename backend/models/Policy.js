const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  policyNumber: {
    type: String,
    unique: true,
  },

  // Weekly income of gig worker
  weeklyIncome: {
    type: Number,
    required: true,
  },

  // Maximum payout coverage
  // coverageAmount: {
  //   type: Number,
  //   required: true,
  //   min: 1000,
  //   max: 5000,
  // },
  //update
  coverageAmount: {
  type: Number,
  required: true,
  min: 1000,
  max: 50000
},

premiumFrequency: {
  type: String,
  enum: ['Daily', 'Weekly', 'Monthly'],
  default: 'Daily'
},//

  // Base premium calculated from income
  basePremium: {
    type: Number,
    required: true,
  },

  // AI adjusted premium
  calculatedPremium: {
    type: Number,
    required: true,
  },

  // Weekly model (Hackathon rule)
  // premiumFrequency: {
  //   type: String,
  //   enum: ['Weekly'],
  //   default: 'Weekly',
  // },

  // AI risk score
  riskScore: {
    type: Number,
    default: 0,
  },

  // Disruption types covered
  coveredDisruptions: [{
    type: String,
    enum: ['Rain', 'Heatwave', 'Pollution', 'Curfew', 'Flood'],
  }],

  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending', 'Cancelled'],
    default: 'Pending',
  },

  startDate: Date,
  endDate: Date,
  nextPaymentDate: Date,

  termsAccepted: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });


// Auto-generate policy number
policySchema.pre('save', async function(next) {
  if (!this.policyNumber) {
    const count = await mongoose.model('Policy').countDocuments();
    this.policyNumber = `GS-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Policy', policySchema);