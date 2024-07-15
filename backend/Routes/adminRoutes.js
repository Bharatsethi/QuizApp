const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const Message = require('../models/Message');
const Translation = require('../models/Translation');

// Define admin routes
router.post('/admin/messages', async (req, res) => {
  const { text } = req.body;
  try {
    const message = new Message({ text });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create message' });
  }
});

router.get('/admin/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages admin/messages' });
  }
});

router.put('/admin/messages/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const message = await Message.findByIdAndUpdate(id, { text }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
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

router.delete('/admin/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Message.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Translation routes
router.get('/admin/translations', async (req, res) => {
  try {
    const translations = await Translation.find();
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
});

router.post('/admin/translations', async (req, res) => {
  const { plan, chapter, lesson, topic, question, answer, admin, username, email, password } = req.body;
  try {
    const translations = new Translation({ plan, chapter, lesson, topic, question, answer, admin, username, email, password });
    await translations.save();
    res.status(201).json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create translations' });
  }
});

router.put('/admin/translations/:id', async (req, res) => {
  const { id } = req.params;
  const { plan, chapter, lesson, topic, question, answer, admin, username, email, password } = req.body;
  try {
    const translations = await Translation.findByIdAndUpdate(id, { plan, chapter, lesson, topic, question, answer, admin, username, email, password }, { new: true });
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update translations' });
  }
});

router.delete('/admin/translations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Translation.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete translations' });
  }
});

// Plan routes
router.post('/admin/plans', async (req, res) => {
  const { title, description, admin } = req.body;
  try {
    const plan = new Plan({ title, description, admin });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

router.put('/admin/plans/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const plan = await Plan.findByIdAndUpdate(id, { title, description }, { new: true });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

router.delete('/admin/plans/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Plan.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// Chapter routes
router.post('/admin/chapters', async (req, res) => {
  const { planId, title, introduction, overview } = req.body;
  try {
    const chapter = new Chapter({ planId, title, introduction, overview });
    await chapter.save();
    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

router.put('/admin/chapters/:id', async (req, res) => {
  const { id } = req.params;
  const { title, introduction, overview } = req.body;
  try {
    const chapter = await Chapter.findByIdAndUpdate(id, { title, introduction, overview }, { new: true });
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chapter' });
  }
});

router.delete('/admin/chapters/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Chapter.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chapter' });
  }
});

// Lesson routes
router.post('/admin/lessons', async (req, res) => {
  const { chapterId, title, content } = req.body;
  try {
    const lesson = new Lesson({ chapterId, title, content });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

router.put('/admin/lessons/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const lesson = await Lesson.findByIdAndUpdate(id, { title, content }, { new: true });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

router.delete('/admin/lessons/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Lesson.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Topic routes
router.post('/admin/topics', async (req, res) => {
  const { lessonId, title, content } = req.body;
  try {
    const topic = new Topic({ lessonId, title, content });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

router.put('/admin/topics/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const topic = await Topic.findByIdAndUpdate(id, { title, content }, { new: true });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

router.delete('/admin/topics/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Topic.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// Quiz routes
router.post('/admin/quizzes', async (req, res) => {
  const { lessonIds, questions } = req.body;
  try {
    const quiz = new Quiz({ lessonIds, questions });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

router.put('/admin/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  const { lessonIds, questions } = req.body;
  try {
    const quiz = await Quiz.findByIdAndUpdate(id, { lessonIds, questions }, { new: true });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

router.delete('/admin/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Quiz.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

module.exports = router;
