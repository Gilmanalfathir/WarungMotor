const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/', authController.registerUser);

module.exports = router;