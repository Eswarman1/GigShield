const express = require('express');
const {
  getUserPolicies,
  getPolicyById,
  createPolicy,
  activatePolicy,
  cancelPolicy,
  recalculatePremium,
} = require('../controllers/policyController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/', auth, getUserPolicies);
router.get('/:id', auth, getPolicyById);
router.post('/', auth, createPolicy);
router.post('/:id/activate', auth, activatePolicy);
router.post('/:id/cancel', auth, cancelPolicy);
router.post('/:id/recalculate-premium', auth, recalculatePremium);

module.exports = router;
