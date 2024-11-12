const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  await User.create({ username, password });
  res.redirect('/login');
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.checkPassword(password)) {
    req.session.userId = user._id;
    res.redirect('/');
  } else {
    res.send('Invalid username or password');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
