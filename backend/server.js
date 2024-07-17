const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Ensure bcryptjs is installed and used consistently
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superUserRoutes = require('./routes/superUserRoutes');

const User = require('./models/User'); // Ensure User model is imported

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.SECRET_KEY;
const API_URL = process.env.API_URL;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const superUserEmail = 'support@poojabharat.com';
    User.findOne({ email: superUserEmail })
      .then(existingSuperUser => {
        if (!existingSuperUser) {
          return bcrypt.hash('PoojaBharat', 10)
            .then(hashedPassword => {
              const superUser = new User({
                username: 'PoojaBharatQuizAppAdmin',
                email: superUserEmail,
                password: hashedPassword,
                role: 'superuser',
              });
              return superUser.save();
            })
            .then(() => {
              console.log('SuperUser created');
            });
        } else {
          console.log('SuperUser already exists');
        }
      })
      .catch(error => {
        console.error('Error checking or creating SuperUser:', error);
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
