const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Answer = require('../models/Answer');
const Plan = require('../models/Plan');
const Quiz = require('../models/Quiz');
const Translation = require('../models/Translation');
const SECRET_KEY = process.env.SECRET_KEY;
const API_URL = process.env.API_URL;

// Fetch answers by quizId
router.get('/quiz/:quizId/answers', async (req, res) => {
  const { quizId } = req.params;
  try {
    const answers = await Answer.find({ quizId }).populate('userId', 'username');
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch answers' });
  }
});

// Submit quiz answers
router.post('/quizzes/:quizId/submit', async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  try {
    for (const answer of answers) {
      const newAnswer = new Answer({
        userId: answer.userId,
        quizId,
        questionId: answer.questionId,
        answer: answer.answer,
      });
      await newAnswer.save();
    }
    res.status(200).json({ message: 'Answers submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answers' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/user/profile', async (req, res) => {
  const { userId, name, email, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
router.get('/user/profile/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, email });
  await user.save();
  res.status(201).send('User registered');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY);
  res.json({ token });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');
  
  const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'support@poojabharta.com',
    to: user.email,
    subject: 'Password Reset',
    text: `To reset your password, click the following link: http://${API_URL}/reset-password?token=${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      res.status(200).send('Password reset email sent');
    }
  });
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
    res.status(200).send('Password reset successful');
  } catch (error) {
    res.status(400).send('Invalid or expired token');
  }
});

// Fetch quizzes by plan ID
router.get('/plans/:planId/quizzes', async (req, res) => {
  const { planId } = req.params;
  try {
    const quizzes = await Quiz.find({ planId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find().populate('admin', 'username');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

router.get('/plans/:id/chapters', async (req, res) => {
  const { id } = req.params;
  try {
    const chapters = await Chapter.find({ planId: id });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Translation routes
router.get('/translations', async (req, res) => {
  try {
    const translations = await Translation.find();
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

module.exports = router;
