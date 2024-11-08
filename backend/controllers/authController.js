const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SALT_ROUNDS = 10;
const TOKEN_EXPIRATION = '1h';

// generate token
const generateToken = (user) => {
  const payload = { 
    userId: user.id, 
    role: user.role 
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: TOKEN_EXPIRATION 
  });
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, role = 'buyer' } = req.body;
  
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        msg: 'User already exists',
        errorCode: 'USER_EXISTS'
      });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role 
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ 
      msg: 'Server error during registration',
      errorCode: 'REGISTRATION_FAILED'
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        msg: 'Invalid credentials',
        errorCode: 'USER_NOT_FOUND'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        msg: 'Invalid credentials',
        errorCode: 'INVALID_PASSWORD'
      });
    }

    const token = generateToken(user);

    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ 
      msg: 'Server error during login',
      errorCode: 'LOGIN_FAILED'
    });
  }
};