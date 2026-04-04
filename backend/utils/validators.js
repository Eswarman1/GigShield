const express = require('express');
const { body, validationResult } = require('express-validator');

// =============================
// USER REGISTRATION VALIDATION
// =============================
const registerValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone is required'),
];

// =============================
// POLICY CREATION VALIDATION
// =============================
const policyValidation = [
  body('weeklyIncome')
    .isNumeric()
    .withMessage('Weekly income must be a number'),

  body('coverageLimit')
    .isNumeric()
    .withMessage('Coverage limit must be a number'),

  body('workingHours')
    .isNumeric()
    .withMessage('Working hours must be a number'),
];

// =============================
// CLAIM VALIDATION
// ONLY INCOME LOSS CLAIMS
// =============================
const claimValidation = [

  body('incomeBeforeDisruption')
    .isNumeric()
    .withMessage('Income before disruption must be numeric'),

  body('incomeAfterDisruption')
    .isNumeric()
    .withMessage('Income after disruption must be numeric'),

  body('daysDisrupted')
    .isInt({ min: 1, max: 7 })
    .withMessage('Days disrupted must be between 1 and 7'),

  body('disruptionType')
    .isIn([
      'heavy_rain',
      'extreme_heat',
      'severe_pollution',
      'flood',
      'curfew',
      'zone_closure'
    ])
    .withMessage('Invalid claim reason. Only environmental disruptions allowed'),
];

// =============================
// VALIDATION RESULT HANDLER
// =============================
const validateRequest = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  next();
};

module.exports = {
  registerValidation,
  policyValidation,
  claimValidation,
  validateRequest,
};