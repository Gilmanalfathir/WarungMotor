const express = require('express');
const router = express.Router();

// API endpoint routes
const registerRoute = require('../api/auth/register');
const loginRoute = require('../api/auth/login');
const profileRoute = require('../api/auth/profile');
const passwordRoute = require('../api/auth/password');
const usersRoute = require('../api/auth/users');
const deleteRoute = require('../api/auth/delete');

// Mount API routes
router.use('/register', registerRoute);
router.use('/login', loginRoute);
router.use('/profile', profileRoute);
router.use('/password', passwordRoute);
router.use('/users', usersRoute);
router.use('/delete', deleteRoute);

module.exports = router;