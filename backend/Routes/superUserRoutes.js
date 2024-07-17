const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');  // Ensure bcryptjs is required

router.post('/superuser/admin', async (req, res) => {
  const { username, email, password, plans } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({ username, password: hashedPassword, email, role: 'admin', plans });
    await adminUser.save();
    res.status(201).send('Admin created successfully');
  } catch (error) {
    console.error('Internal server error:', error);  // Enhanced error logging
    res.status(500).send('Internal server error');
  }
});

router.put('/superuser/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.username = username;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});

router.delete('/superuser/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
});

router.get('/superuser/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
