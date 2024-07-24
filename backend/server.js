const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superUserRoutes = require('./routes/superUserRoutes');

const User = require('./models/User');
const Translation = require('./models/Translation');
const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.SECRET_KEY;
const API_URL = process.env.API_URL;

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');

    const superUserEmail = 'support@poojabharat.com';
    const existingSuperUser = await User.findOne({ email: superUserEmail });
    if (!existingSuperUser) {
      const hashedPassword = await bcrypt.hash('PoojaBharat', 10);
      const isMatch = await bcrypt.compare('PoojaBharat', hashedPassword);
      if (isMatch) {
        console.log('Password match');
      } else {
        console.log('Password does not match');
      }
      const superUser = new User({
        username: 'PoojaBharatQuizAppAdmin',
        email:superUserEmail,
        password:hashedPassword,
        role:'superuser',
      });
      await superUser.save();
      console.log('SuperUser created',superUser);
    } else {
      console.log('SuperUser already exists');
    }

    const translationExist = 'Exist';
    Translation.findOne({ translation: translationExist })
      .then(async existingTranslations => {
        if (!existingTranslations) {
          const defaultTranslations = new Translation({
            translation: 'Exist',
            plan: 'Plan',
            chapter: 'Chapter',
            lesson: 'Lesson',
            topic: 'Topic',
            question: 'Question',
            answer: 'Answer',
            admin: 'Admin',
            username: 'Username',
            email: 'Email',
            password: 'Password',
            enterEmail: 'Enter your email',
            enterUsername: 'Enter your username',
            enterPassword: 'Enter your password',
            userRegisteredSuccessfully: 'User registered successfully',
            success: 'Success',
            error: 'Error',
            somethingWentWrong: 'Something went wrong',
            welcomeMessageRegister: 'Welcome to our Quiz App! Join us and start learning today.',
            register: 'Register',
            backToLogin: 'Back to Login',
            welcomeMessage: 'Welcome to our Quiz App! Enjoy learning with our interactive quizzes.',
            login: 'Login',
            forgotPassword: 'Forgot Password',
            invalidToken: 'Invalid token received',
            loggedInSuccessfully: 'Logged in successfully',
            passwordResetEmailSent: 'Password reset email sent',
            passwordResetError: 'Error sending password reset email',
            sendPasswordResetEmail: 'Reset Password',
            optional: 'Optional',
            saveButton: 'Save',
            cancel: 'Cancel',
            actions: 'Actions',
            addAdmin: 'Add Admin',
            logout: 'Logout',
            searchPlaceholder: 'Search users...',
            userUpdatedSuccessfully: 'User detail has been updated',
            saveTranslation: 'Save Dictionary',
          });

          console.log('Default translations object:', defaultTranslations);
          await defaultTranslations.save();
          console.log('Default translations created');
        } else {
          console.log('Translations already exist');
        }
      })
      .catch(error => {
        console.error('Error checking or creating translations:', error);
      });
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err);
  });

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/', superUserRoutes);
app.use('/', healthRoutes); // Add the health routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
