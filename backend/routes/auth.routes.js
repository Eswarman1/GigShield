const express = require('express');
const { register, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone is required'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;
