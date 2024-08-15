const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./Routes/userRoutes');
const healthRoutes = require('./Routes/healthRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const superUserRoutes = require('./Routes/superUserRoutes');

const User = require('./models/User');
const Translation = require('./models/Translation');
const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.SECRET_KEY;
const API_URL = process.env.API_URL;
const SUPERUSER_EMAIL = process.env.SUPERUSER_EMAIL || 'support@poojabharat.com';
const SUPERUSER_PASSWORD = process.env.SUPERUSER_PASSWORD || 'PoojaBharat';

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await initializeSuperUser();
    await initializeTranslations();
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

// Function to initialize the super user
async function initializeSuperUser() {
  try {
    const existingSuperUser = await User.findOne({ email: SUPERUSER_EMAIL });
    if (!existingSuperUser) {
      const hashedPassword = await bcrypt.hash(SUPERUSER_PASSWORD, 10);
      const superUser = new User({
        username: 'PoojaBharatQuizAppAdmin',
        email: SUPERUSER_EMAIL,
        password: hashedPassword,
        role: 'superuser',
      });
      await superUser.save();
      console.log('SuperUser created:', superUser);
    } else {
      console.log('SuperUser already exists');
    }
  } catch (error) {
    console.error('Error creating superuser:', error);
  }
}

// Function to initialize default translations
async function initializeTranslations() {
  try {
    const translationExist = 'Exist';
    const existingTranslations = await Translation.findOne({ translation: translationExist });

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
        add: 'Add',
        quiz: 'Quiz',
      });

      console.log('Default translations object:', defaultTranslations);
      await defaultTranslations.save();
      console.log('Default translations created');
    } else {
      console.log('Translations already exist');
    }
  } catch (error) {
    console.error('Error checking or creating translations:', error);
  }
}
