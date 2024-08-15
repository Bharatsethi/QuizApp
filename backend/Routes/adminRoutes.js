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
const UserPlan = require('../models/UserPlan'); // Import the UserPlan model

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
    const message = await Message.findOneAndUpdate(
      { _id: id, admin: adminId },
      { message: { text } },
      { new: true }
    );
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
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

// Plan routes
router.post('/admin/plans', async (req, res) => {
  const { title, description, adminId } = req.body;
  try {
    const plan = new Plan({ title, description, admin: adminId });
    await plan.save();

    // Add the admin as the first user in the UserPlan collection
    const userPlan = new UserPlan({ user: adminId, plan: plan._id });
    await userPlan.save();

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

router.post('/plans/:planId/request-access', async (req, res) => {
  const { planId } = req.params;
  const { userId } = req.body;

  try {
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check if the user is already assigned to the plan
    const existingUserPlan = await UserPlan.findOne({ user: userId, plan: planId });
    if (existingUserPlan) {
      return res.status(400).json({ error: 'User already assigned to this plan' });
    }

    // Add the user to the plan
    const userPlan = new UserPlan({ user: userId, plan: planId });
    await userPlan.save();

    res.status(200).json({ message: 'User added to plan successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user to plan' });
  }
});

router.post('/admin/plans/:planId/view-as-user', async (req, res) => {
  const { planId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the user is already assigned to the plan
    let userPlan = await UserPlan.findOne({ user: userId, plan: planId });

    // If not, add the user to the plan
    if (!userPlan) {
      userPlan = new UserPlan({ user: userId, plan: planId });
      await userPlan.save();
    }

    res.status(200).json({ message: 'User now associated with the plan' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user to plan for viewing' });
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
    const plan = await Plan.findOneAndUpdate(
      { _id: id, admin: adminId },
      { title, description },
      { new: true }
    );
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

router.delete('/admin/plans/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    const deletedPlan = await Plan.findOneAndDelete({ _id: id, admin: adminId });
    if (!deletedPlan) {
      return res.status(404).json({ error: 'Plan not found or unauthorized' });
    }

    // Remove all UserPlan associations
    await UserPlan.deleteMany({ plan: id });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// Chapter routes
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
    res.status(500).json({ error: 'Failed to create chapter' });
  }
});

router.get('/admin/all-chapters', async (req, res) => {
  const { adminId } = req.query;
  try {
    const chapters = await Chapter.find({ admin: adminId });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

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

router.delete('/admin/chapters/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId, action } = req.body; // action can be 'delete' or 'unlink'

  try {
    if (action === 'delete') {
      // Delete chapter completely
      const deletedChapter = await Chapter.findOneAndDelete({ _id: id, admin: adminId });
      if (!deletedChapter) {
        return res.status(404).json({ error: 'Chapter not found or unauthorized' });
      }
      res.status(204).send();
    } else if (action === 'unlink') {
      const chapter = await Chapter.findById(id);
      if (!chapter) {
        return res.status(404).json({ error: 'Chapter not found' });
      }
      // Unlink the chapter from the plan
      chapter.planId = null;
      await chapter.save();
      res.status(200).json({ message: 'Chapter unlinked from plan' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete or unlink chapter' });
  }
});

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
  if (!chapterId || !title || !content) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const lesson = new Lesson({ chapterId, title, content, admin: adminId });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status500().json({ error: 'Failed to create lesson' });
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
    const lesson = await Lesson.findOneAndUpdate(
      { _id: id, admin: adminId },
      { title, content },
      { new: true }
    );
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

router.delete('/admin/lessons/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId, action } = req.body; // action can be 'delete' or 'unlink'

  try {
    if (action === 'delete') {
      const deletedLesson = await Lesson.findOneAndDelete({ _id: id, admin: adminId });
      if (!deletedLesson) {
        return res.status(404).json({ error: 'Lesson not found or unauthorized' });
      }
      res.status(204).send();
    } else if (action === 'unlink') {
      const lesson = await Lesson.findById(id);
      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }
      lesson.chapterId = null;
      await lesson.save();
      res.status(200).json({ message: 'Lesson unlinked from chapter' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete or unlink lesson' });
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
    const topic = await Topic.findOneAndUpdate(
      { _id: id, admin: adminId },
      { title, content },
      { new: true }
    );
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

router.delete('/admin/topics/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId, action } = req.body; // action can be 'delete' or 'unlink'

  try {
    if (action === 'delete') {
      const deletedTopic = await Topic.findOneAndDelete({ _id: id, admin: adminId });
      if (!deletedTopic) {
        return res.status(404).json({ error: 'Topic not found or unauthorized' });
      }
      res.status(204).send();
    } else if (action === 'unlink') {
      const topic = await Topic.findById(id);
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
      topic.lessonId = null;
      await topic.save();
      res.status(200).json({ message: 'Topic unlinked from lesson' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete or unlink topic' });
  }
});

// Quiz routes
router.get('/quizzes', async (req, res) => {
  const { contextId } = req.query;
  try {
    const quizzes = await Quiz.find({ contextId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

router.post('/admin/quizzes', async (req, res) => {
  const { contextId, contextType, title, questions, googleFormUrl, adminId } = req.body;
  if (!contextId || !contextType || !title || !adminId) {
    return res.status(400).json({ error: 'contextId, contextType, title, and adminId are required' });
  }

  try {
    const newQuiz = new Quiz({
      contextId,
      contextType,
      title,
      questions,
      googleFormUrl,
      admin: adminId,
    });
    await newQuiz.save();
    res.status(201).json(newQuiz);
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
    const quiz = await Quiz.findOneAndUpdate(
      { _id: id, admin: adminId },
      { title, questions },
      { new: true }
    );
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

router.delete('/admin/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    const deletedQuiz = await Quiz.findOneAndDelete({ _id: id, admin: adminId });
    if (!deletedQuiz) {
      return res.status(404).json({ error: 'Quiz not found or unauthorized' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

router.post('/admin/quizzes/:quizId/resequence', async (req, res) => {
  const { quizId } = req.params;
  const { questionIds } = req.body;

  if (!questionIds || !Array.isArray(questionIds)) {
    return res.status(400).json({ error: 'questionIds is required and should be an array' });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Update the sequence of questions
    quiz.questions = questionIds;
    await quiz.save();

    res.status(200).json({ message: 'Questions resequenced successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resequence questions' });
  }
});

// Question routes
router.post('/admin/questions', async (req, res) => {
  const { quizIds, text, options, type, adminId } = req.body;
  if (!quizIds || !text || !type || !adminId) {
    return res.status(400).json({ error: 'quizIds, text, type, and adminId are required' });
  }

  try {
    const newQuestion = new Question({
      text,
      type,
      options: type === 'multiple-choice' ? options : undefined,
      admin: adminId,
      quizIds
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question' });
  }
});

router.get('/admin/questions', async (req, res) => {
  const { adminId, quizId } = req.query;
  try {
    const query = { admin: adminId };
    if (quizId) query.quizIds = quizId;

    const questions = await Question.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

router.put('/admin/questions/:id', async (req, res) => {
  const { id } = req.params;
  const { questionText, options, correctAnswer, adminId } = req.body;
  try {
    const question = await Question.findOneAndUpdate(
      { _id: id, admin: adminId },
      { questionText, options, correctAnswer },
      { new: true }
    );
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
});

router.delete('/admin/questions/:id', async (req, res) => {
  const { id } = req.params;
  const { adminId } = req.body;
  try {
    const deletedQuestion = await Question.findOneAndDelete({ _id: id, admin: adminId });
    if (!deletedQuestion) {
      return res.status(404).json({ error: 'Question not found or unauthorized' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

router.post('/admin/quizzes/:quizId/questions/:questionId', async (req, res) => {
  const { quizId, questionId } = req.params;
  const { adminId } = req.body;
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, admin: adminId },
      { $push: { questions: questionId } },
      { new: true }
    );
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found or unauthorized' });
    }
    res.status(200).json({ message: 'Question linked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to link question' });
  }
});

// Generalized route to link or unlink a quiz or question to a context
router.post('/admin/context/:contextType/:contextId/link', async (req, res) => {
  const { contextType, contextId } = req.params;
  const { itemId, itemType, action } = req.body; // Link or unlink, itemType can be 'quiz' or 'question'

  try {
    const modelMap = {
      plan: Plan,
      chapter: Chapter,
      lesson: Lesson,
      topic: Topic
    };

    if (!modelMap[contextType]) {
      return res.status(400).json({ error: 'Invalid context type' });
    }

    const context = await modelMap[contextType].findById(contextId);
    if (!context) {
      return res.status(404).json({ error: `${contextType} not found` });
    }

    const updateField = itemType === 'quiz' ? 'quizzes' : 'questions';
    const update = action === 'link' ? { $push: { [updateField]: itemId } } : { $pull: { [updateField]: itemId } };
    
    await modelMap[contextType].findByIdAndUpdate(contextId, update, { new: true });
    res.json({ message: `${itemType} successfully ${action}ed.` });
  } catch (error) {
    res.status(500).json({ error: 'Database operation failed' });
  }
});

module.exports = router;
