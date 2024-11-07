const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const router = express.Router();
const roleCheck = require('../middlewares/roleCheck');

/**
 * @route   POST api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', authController.registerUser);

/**
 * @route   POST api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', authController.loginUser);

/**
 * @route   GET api/auth/user
 * @desc    Get authenticated user
 * @access  Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password'); 
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT api/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/update-profile', auth, async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    
    // Remove password from response
    user = user.toObject();
    delete user.password;

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   PUT api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE api/auth/delete-account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/delete-account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndDelete(req.user.userId);
    res.json({ msg: 'User account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/auth/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/users', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  /**
   * @route   PUT api/auth/user/:id/role
   * @desc    Update user role (admin only)
   * @access  Private/Admin
   */
  router.put('/user/:id/role', [auth, roleCheck(['admin'])], async (req, res) => {
    try {
      const { role } = req.body;
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      user.role = role;
      await user.save();
  
      res.json({ msg: 'User role updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;