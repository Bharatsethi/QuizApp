const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Translation = require('../models/Translation');

// Endpoint to create a new admin user
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
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});

// Endpoint to update user details
router.put('/superuser/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const updateUser = { username, email };
    if (password) {
      updateUser.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updateUser, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});

// Endpoint to delete a user
router.delete('/superuser/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(204).send('User deleted successfully');
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});

// Endpoint to fetch all users
router.get('/superuser/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});

// Translation routes
router.get('/superuser/translations', async (req, res) => {
  try {
    const translations = await Translation.find();
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

router.post('/superuser/translations', async (req, res) => {
  const { plan, chapter, lesson, topic, question, answer, admin, username, email, password } = req.body;
  try {
    const translations = new Translation({ plan, chapter, lesson, topic, question, answer, admin, username, email, password });
    await translations.save();
    res.status(201).json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create translations' });
  }
});

router.put('/superuser/translations/:id', async (req, res) => {
  const { id } = req.params;
  const { plan, chapter, lesson, topic, question, answer, admin, username, email, password } = req.body;
  try {
    const translations = await Translation.findByIdAndUpdate(id, { plan, chapter, lesson, topic, question, answer, admin, username, email, password }, { new: true });
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update translations' });
  }
});

router.delete('/superuser/translations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Translation.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete translations' });
  }
});

// Endpoint to fetch current admin details
router.get('/superuser/admin/current', async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' });
    res.json(admin);
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
