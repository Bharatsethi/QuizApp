/*
Test the Health Check Endpoint
Use Postman or a web browser to test the health check endpoint:
URL: http://192.168.0.75:3002/health
Method: GET
*/
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // or any other model
const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    //conslon.log('health');
    // Attempt to fetch one record from the User collection
    const user = await User.findOne();
    if (user) {
      res.status(200).json({ message: 'Database connection is healthy', user });
    } else {
      res.status(200).json({ message: 'Database connection is healthy, but no users found' });
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).json({ message: 'Error connecting to the database', error: error.message });
  }
});

// User login
router.post('/login2', async (req, res) => {
    //conslon.log('login2');
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ error: user.password, role:user.role});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: user.password, role:user.role,email:user.email,password:{password} });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY);
    res.json({ token });
  });

module.exports = router;
