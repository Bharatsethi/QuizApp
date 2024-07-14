const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Plan = require('./models/Plan');
const Chapter = require('./models/Chapter');
const Lesson = require('./models/Lesson');
const Topic = require('./models/Topic');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/QuizApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

const messageSchema = new mongoose.Schema({
  text: String,
});

const Message = mongoose.model('Message', messageSchema);

// Add a message
app.post('/admin/messages', async (req, res) => {
  const { text } = req.body;
  const message = new Message({ text });
  await message.save();
  res.status(201).json(message);
});

// Fetch all messages
app.get('/messages', async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// Update a message
app.put('/admin/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const message = await Message.findByIdAndUpdate(id, { text }, { new: true });
  res.json(message);
});

// Delete a message
app.delete('/admin/messages/:id', async (req, res) => {
  const { id } = req.params;
  await Message.findByIdAndDelete(id);
  res.status(204).send();
});

// Plan routes
app.post('/admin/plans', async (req, res) => {
  const { title, description } = req.body;
  const plan = new Plan({ title, description });
  await plan.save();
  res.status(201).json(plan);
});

app.put('/admin/plans/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const plan = await Plan.findByIdAndUpdate(id, { title, description }, { new: true });
  res.json(plan);
});

app.delete('/admin/plans/:id', async (req, res) => {
  const { id } = req.params;
  await Plan.findByIdAndDelete(id);
  res.status(204).send();
});

// Chapter routes
app.post('/admin/chapters', async (req, res) => {
  const { planId, title, introduction, overview } = req.body;
  const chapter = new Chapter({ planId, title, introduction, overview });
  await chapter.save();
  res.status(201).json(chapter);
});

app.put('/admin/chapters/:id', async (req, res) => {
  const { id } = req.params;
  const { title, introduction, overview } = req.body;
  const chapter = await Chapter.findByIdAndUpdate(id, { title, introduction, overview }, { new: true });
  res.json(chapter);
});

app.delete('/admin/chapters/:id', async (req, res) => {
  const { id } = req.params;
  await Chapter.findByIdAndDelete(id);
  res.status(204).send();
});

// Lesson routes
app.post('/admin/lessons', async (req, res) => {
  const { chapterId, title, content } = req.body;
  const lesson = new Lesson({ chapterId, title, content });
  await lesson.save();
  res.status(201).json(lesson);
});

app.put('/admin/lessons/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const lesson = await Lesson.findByIdAndUpdate(id, { title, content }, { new: true });
  res.json(lesson);
});

app.delete('/admin/lessons/:id', async (req, res) => {
  const { id } = req.params;
  await Lesson.findByIdAndDelete(id);
  res.status(204).send();
});

// Topic routes
app.post('/admin/topics', async (req, res) => {
  const { lessonId, title, content } = req.body;
  const topic = new Topic({ lessonId, title, content });
  await topic.save();
  res.status(201).json(topic);
});

app.put('/admin/topics/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const topic = await Topic.findByIdAndUpdate(id, { title, content }, { new: true });
  res.json(topic);
});

app.delete('/admin/topics/:id', async (req, res) => {
  const { id } = req.params;
  await Topic.findByIdAndDelete(id);
  res.status(204).send();
});

// Quiz routes
app.post('/admin/quizzes', async (req, res) => {
  const { lessonIds, questions } = req.body;
  const quiz = new Quiz({ lessonIds, questions });
  await quiz.save();
  res.status(201).json(quiz);
});

app.put('/admin/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  const { lessonIds, questions } = req.body;
  const quiz = await Quiz.findByIdAndUpdate(id, { lessonIds, questions }, { new: true });
  res.json(quiz);
});

// Update user profile
app.put('/user/profile', async (req, res) => {
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
app.get('/user/profile/:id', async (req, res) => {
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


app.delete('/admin/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  await Quiz.findByIdAndDelete(id);
  res.status(204).send();
});



app.post('/register', async (req, res) => {
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

app.post('/login', async (req, res) => {
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
  const token = jwt.sign({ userId: user._id }, 'secretkey');
  res.json({ token });
});


app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');
  
  const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Password Reset',
    text: `To reset your password, click the following link: http://localhost:3000/reset-password?token=${token}`,
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

app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, 'secretkey');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
    res.status(200).send('Password reset successful');
  } catch (error) {
    res.status(400).send('Invalid or expired token');
  }
});

// Plan routes
app.get('/plans', async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
});

app.get('/plans/:id/chapters', async (req, res) => {
  const { id } = req.params;
  const chapters = await Chapter.find({ planId: id });
  res.json(chapters);
});

// Chapter routes
app.get('/chapters/:id/lessons', async (req, res) => {
  const { id } = req.params;
  const lessons = await Lesson.find({ chapterId: id });
  res.json(lessons);
});

// Lesson routes
app.get('/lessons/:id/topics', async (req, res) => {
  const { id } = req.params;
  const topics = await Topic.find({ lessonId: id });
  res.json(topics);
});

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
