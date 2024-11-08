const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const User = require('../../models/User');

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', auth, async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    
    user = user.toObject();
    delete user.password;

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;