const express = require('express');
const {
  getUserClaims,
  getClaimById,
  submitClaim,
  updateClaimStatus,
  withdrawClaim,
  checkDisruption,
} = require('../controllers/claimController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.post('/check-disruption', auth, checkDisruption);
router.get('/', auth, getUserClaims);
router.get('/:id', auth, getClaimById);
router.post('/', auth, submitClaim);
router.post('/:id/update-status', auth, updateClaimStatus);
router.post('/:id/withdraw', auth, withdrawClaim);

module.exports = router;
