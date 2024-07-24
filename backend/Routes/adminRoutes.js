const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Plan = require('../models/Plan');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const Message = require('../models/Message');
const Question = require('../models/Question');
const User = require('../models/User');
const Translation = require('../models/Translation');

// Message routes
router.post('/admin/messages', async (req, res) => {
  const { text, adminId } = req.body;
  try {
    const message = new Message({ message: { text }, admin: adminId });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

router.get('/admin/messages', async (req, res) => {
  const { adminId } = req.query;
  try {
    const messages = await Message.find({ admin: adminId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.put('/admin/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { text, adminId } = req.body;
  try {
    const message = await Message.findOneAndUpdate({ _id: id, admin: adminId }, { message: { text } }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Define the route to get the current admin
router.get('/admin/current', async (req, res) => {
  try {
    // Assuming you have some logic to get the current logged-in admin
    const adminId = req.admin._id; // This will depend on your authentication middleware
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current admin' });
  }
});

router.delete('/admin/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    await Message.findOneAndDelete({ _id: id, admin: adminId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages /messages' });
  }
}); 

// Fetch all users
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add user to plan
router.post('/admin/plans/:planId/users/:userId', async (req, res) => {
  const { planId, userId } = req.params;
  try {
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    plan.users.push(userId);
    await plan.save();
    res.status(200).json({ message: 'User added to plan' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user to plan' });
  }
});

// Plan routes
router.post('/admin/plans', async (req, res) => {
  const { title, description, adminId } = req.body;
  try {
    const plan = new Plan({ title, description, admin: adminId });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

router.get('/admin/plans', async (req, res) => {
  const { adminId } = req.query;
  try {
    const plans = await Plan.find({ admin: adminId });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

router.put('/admin/plans/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, adminId } = req.body;
  try {
    const plan = await Plan.findOneAndUpdate({ _id: id, admin: adminId }, { title, description }, { new: true });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

router.delete('/admin/plans/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    await Plan.findOneAndDelete({ _id: id, admin: adminId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// Create a new chapter
router.post('/admin/chapters', async (req, res) => {
  const { planId, title, introduction, overview, admin } = req.body;

  // Basic validation
  if (!planId || !title || !introduction || !overview || !admin) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newChapter = new Chapter({ planId, title, introduction, overview, admin });
    await newChapter.save();
    res.status(201).json(newChapter);
  } catch (error) {
    console.error('Failed to create chapter:', error); // Improved logging
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

// Fetch all chapters created by an admin
router.get('/admin/all-chapters', async (req, res) => {
  const { adminId } = req.query;
  try {
    const chapters = await Chapter.find({ admin: adminId });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Update Chapter route
router.put('/admin/chapters/:id', async (req, res) => {
  const { id } = req.params;
  const { title, introduction, overview, adminId } = req.body;
  try {
    const chapter = await Chapter.findOneAndUpdate(
      { _id: id, admin: adminId },
      { title, introduction, overview },
      { new: true }
    );
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chapter' });
  }
});

// Delete or Unlink Chapter route
router.delete('/admin/chapters/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId, action, planId } = req.body; // action can be 'delete' or 'unlink'

  try {
    if (action === 'delete') {
      await Chapter.findOneAndDelete({ _id: id, admin: adminId });
      res.status(204).send();
    } else if (action === 'unlink') {
      const chapter = await Chapter.findById(id);
      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }
      // Unlinking the chapter from the plan
      await Plan.findByIdAndUpdate(planId, { $pull: { chapters: id } });
      res.status(200).json({ message: 'Chapter unlinked from plan' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete or unlink chapter' });
  }
});


router.get('/admin/chapters', async (req, res) => {
  const { adminId } = req.query;
  try {
    const chapters = await Chapter.find({ admin: adminId });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});


// Get chapters for a specific plan
router.get('/plans/:planId/chapters', async (req, res) => {
  const { planId } = req.params;
  try {
    const chapters = await Chapter.find({ planId });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chapters for plan' });
  }
});

// Lesson routes
router.post('/admin/lessons', async (req, res) => {
  const { chapterId, title, content, adminId } = req.body;
  // Validate the incoming request
  if (!chapterId || !title || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const lesson = new Lesson({ chapterId, title, content, admin: adminId });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

router.get('/admin/lessons', async (req, res) => {
  const { adminId } = req.query;
  try {
    const lessons = await Lesson.find({ admin: adminId });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

router.put('/admin/lessons/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, adminId } = req.body;
  try {
    const lesson = await Lesson.findOneAndUpdate({ _id: id, admin: adminId }, { title, content }, { new: true });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

router.delete('/admin/lessons/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    await Lesson.findOneAndDelete({ _id: id, admin: adminId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Topic routes
router.post('/admin/topics', async (req, res) => {
  const { lessonId, title, content, adminId } = req.body;
  try {
    const topic = new Topic({ lessonId, title, content, admin: adminId });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

router.get('/admin/topics', async (req, res) => {
  const { adminId } = req.query;
  try {
    const topics = await Topic.find({ admin: adminId });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

router.put('/admin/topics/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, adminId } = req.body;
  try {
    const topic = await Topic.findOneAndUpdate({ _id: id, admin: adminId }, { title, content }, { new: true });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

router.delete('/admin/topics/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    await Topic.findOneAndDelete({ _id: id, admin: adminId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// Quiz routes
router.post('/admin/quizzes', async (req, res) => {
  const { planId, title, questions, adminId } = req.body;
  try {
    const quiz = new Quiz({ planId, title, questions, admin: adminId });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

router.get('/admin/quizzes', async (req, res) => {
  const { adminId } = req.query;
  try {
    const quizzes = await Quiz.find({ admin: adminId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

router.put('/admin/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, questions, adminId } = req.body;
  try {
    const quiz = await Quiz.findOneAndUpdate({ _id: id, admin: adminId }, { title, questions }, { new: true });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

router.delete('/admin/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    await Quiz.findOneAndDelete({ _id: id, admin: adminId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// Question routes
router.post('/admin/questions', async (req, res) => {
  const { quizId, questionText, options, correctAnswer, adminId } = req.body;
  try {
    const question = new Question({ quizId, questionText, options, correctAnswer, admin: adminId });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question' });
  }
});

router.get('/admin/questions', async (req, res) => {
  const { adminId } = req.query;
  try {
    const questions = await Question.find({ admin: adminId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

router.put('/admin/questions/:id', async (req, res) => {
  const { id } = req.params;
  const { questionText, options, correctAnswer, adminId } = req.body;
  try {
    const question = await Question.findOneAndUpdate({ _id: id, admin: adminId }, { questionText, options, correctAnswer }, { new: true });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
});

router.put('/unlink-question', async (req, res) => {
  const { contextId, questionId, contextType } = req.body;
  
  try {
    let updatedContext;

    switch (contextType) {
      case 'plan':
        updatedContext = await Plan.findByIdAndUpdate(contextId, { $pull: { questions: questionId } }, { new: true });
        break;
      case 'chapter':
        updatedContext = await Chapter.findByIdAndUpdate(contextId, { $pull: { questions: questionId } }, { new: true });
        break;
      case 'lesson':
        updatedContext = await Lesson.findByIdAndUpdate(contextId, { $pull: { questions: questionId } }, { new: true });
        break;
      case 'topic':
        updatedContext = await Topic.findByIdAndUpdate(contextId, { $pull: { questions: questionId } }, { new: true });
        break;
      default:
        return res.status(400).send('Invalid context type');
    }

    if (!updatedContext) {
      return res.status(404).send('Context not found');
    }

    res.status(200).json(updatedContext);
  } catch (error) {
    console.error('Error unlinking question:', error);
    res.status(500).send('Server error');
  }
});

router.delete('/admin/questions/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    await Question.findOneAndDelete({ _id: id, admin: adminId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// Fetch translations
/*
router.get('/admin/translations', async (req, res) => {
  try {
    console.log('getting translation');
    const translations = await Translation.find();
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});
*/
module.exports = router;
