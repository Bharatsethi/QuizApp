const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Super Admin routes
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
