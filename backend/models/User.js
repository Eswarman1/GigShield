const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  deliveryPlatforms: [{
    type: String,
    enum: ['Uber Eats', 'DoorDash', 'Instacart', 'Amazon Flex', 'Other'],
  }],
  monthlyAverageIncome: {
    type: Number,
    default: 0,
  },
  workingHoursPerWeek: {
    type: Number,
    default: 0,
  },
  bankAccountNumber: String,
  bankRoutingNumber: String,
  documentVerified: {
    type: Boolean,
    default: false,
  },
  identityVerified: {
    type: Boolean,
    default: false,
  },
  activePolicy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
