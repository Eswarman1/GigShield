const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  verifyIdentity,
  verifyDocuments,
} = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.post('/verify-identity', auth, verifyIdentity);
router.post('/verify-documents', auth, verifyDocuments);

module.exports = router;
