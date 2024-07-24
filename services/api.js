import axios from 'axios';

const API_URL = 'http://192.168.0.75:3002';

// Create an instance of axios
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor
apiClient.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

// Add a response interceptor
apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Error Response:', error.response);
    return Promise.reject(error);
  }
);

// Authentication
export const register = async (userData) => {
  return apiClient.post('/register', userData);
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response;
  } catch (error) {
    console.error('Login API call error:', error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentAdmin = async () => {
  return apiClient.get('/admin/current');
};

// Plans
export const fetchPlans = async () => {
  return apiClient.get('/plans');
};

export const fetchPlanById = async (planId) => {
  return apiClient.get(`/plans/${planId}`);
};

export const createPlan = async (planData) => {
  return apiClient.post('/admin/plans', planData);
};

export const updatePlan = async (planId, planData) => {
  return apiClient.put(`/admin/plans/${planId}`, planData);
};

export const deletePlan = async (planId) => {
  return apiClient.delete(`/admin/plans/${planId}`);
};

// Chapters
export const fetchChapters = (planId) => {
  return apiClient.get(`/plans/${planId}/chapters`);
};

export const fetchAllChapters = (adminId) => {
  return apiClient.get('/admin/all-chapters', { params: { adminId } });
};

export const createChapter = async (chapterData) => {
  return apiClient.post('/admin/chapters', chapterData);
};

export const updateChapter = (chapterId, chapterData) => {
  return apiClient.put(`/admin/chapters/${chapterId}`, chapterData);
};

export const deleteChapter = (chapterId, action = 'delete', planId) => {
  return apiClient.delete(`/admin/chapters/${chapterId}`, {
    data: { action, planId },
  });
};

// Users
export const fetchUsers = async () => {
  return apiClient.get('/users');
};

export const fetchUsersbyAdmin = async () => {
  return apiClient.get('/admin/users');
};

export const addUserToPlan = (planId, userId) => {
  return apiClient.post(`/admin/plans/${planId}/users/${userId}`);
};

export const updateUser = async (userId, userData) => {
  return apiClient.put(`/superuser/users/${userId}`, userData);
};

export const createAdmin = async (userData) => {
  return apiClient.post('/superuser/admin', userData);
};

export const deleteUser = async (userId) => {
  return apiClient.delete(`/superuser/users/${userId}`);
};

// Lessons
export const fetchLessons = async (chapterId) => {
  return apiClient.get(`/chapters/${chapterId}/lessons`);
};

export const createLesson = async (lessonData) => {
  return apiClient.post('/admin/lessons', lessonData);
};

export const updateLesson = async (lessonId, lessonData) => {
  return apiClient.put(`/admin/lessons/${lessonId}`, lessonData);
};

export const deleteLesson = async (lessonId) => {
  return apiClient.delete(`/admin/lessons/${lessonId}`);
};

// Link quiz to context endpoint (for example)
router.post('/admin/link-quiz', async (req, res) => {
  const { contextId, quizId, contextType, adminId } = req.body;
  try {
    let update;
    switch (contextType) {
      case 'plan':
        update = await Plan.findByIdAndUpdate(contextId, { $push: { quizzes: quizId } });
        break;
      case 'chapter':
        update = await Chapter.findByIdAndUpdate(contextId, { $push: { quizzes: quizId } });
        break;
      case 'lesson':
        update = await Lesson.findByIdAndUpdate(contextId, { $push: { quizzes: quizId } });
        break;
      case 'topic':
        update = await Topic.findByIdAndUpdate(contextId, { $push: { quizzes: quizId } });
        break;
      default:
        return res.status(400).json({ error: 'Invalid context type' });
    }
    if (!update) {
      return res.status(404).json({ error: 'Context not found' });
    }
    res.status(200).json({ message: 'Quiz linked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to link quiz' });
  }
});


// Topics
export const fetchTopics = async (lessonId) => {
  return apiClient.get(`/lessons/${lessonId}/topics`);
};

export const createTopic = async (topicData) => {
  return apiClient.post('/admin/topics', topicData);
};

export const updateTopic = async (topicId, topicData) => {
  return apiClient.put(`/admin/topics/${topicId}`, topicData);
};

export const deleteTopic = async (topicId) => {
  return apiClient.delete(`/admin/topics/${topicId}`);
};

// Quizzes
export const fetchQuizByLessonId = async (lessonId) => {
  return apiClient.get(`/lessons/${lessonId}/quiz`);
};

export const fetchQuizzesByPlanId = async (planId) => {
  return apiClient.get(`/plans/${planId}/quizzes`);
};

export const createQuiz = async (quizData) => {
  return apiClient.post('/admin/quizzes', quizData);
};

export const updateQuiz = async (quizId, quizData) => {
  return apiClient.put(`/admin/quizzes/${quizId}`, quizData);
};

export const deleteQuiz = async (quizId) => {
  return apiClient.delete(`/admin/quizzes/${quizId}`);
};

export const submitQuiz = async (quizId, answers) => {
  return apiClient.post(`/quizzes/${quizId}/submit`, { answers });
};

export const fetchAnswers = async (quizId) => {
  return apiClient.get(`/quiz/${quizId}/answers`);
};

export const submitAnswer = async (answerData) => {
  return apiClient.post('/answers', answerData);
};

// Messages
export const fetchMessages = async () => {
  return apiClient.get('/admin/messages');
};

export const createMessage = async (messageData) => {
  return apiClient.post('/admin/messages', messageData);
};

export const updateMessage = async (messageId, messageData) => {
  return apiClient.put(`/admin/messages/${messageId}`, messageData);
};

export const deleteMessage = async (messageId) => {
  return apiClient.delete(`/admin/messages/${messageId}`);
};

// Translations
export const fetchTranslations = async () => {
  return apiClient.get('/admin/translations');
};

export const saveTranslations = async (translations) => {
  return apiClient.post('/admin/translations', translations);
};

// Miscellaneous
export const requestAccess = async (data) => {
  return apiClient.post('/request-access', data);
};

export const checkUserAccess = async (userId) => {
  return apiClient.get(`/user-access/${userId}`);
};

export const reportIssue = async (reportData) => {
  return apiClient.post('/report', reportData);
};

export const forgotPassword = async (emailData) => {
  return apiClient.post('/forgot-password', emailData);
};

export const fetchQuestions = async () => {
  return apiClient.get('/questions');
};

export const createQuestion = async (questionData) => {
  return apiClient.post('/admin/questions', questionData);
};

export const updateQuestion = async (questionId, questionData) => {
  return apiClient.put(`/admin/questions/${questionId}`, questionData);
};

export const deleteQuestion = async (questionId) => {
  return apiClient.delete(`/admin/questions/${questionId}`);
};

export const unlinkQuestionFromContext = async (contextId, questionId, contextType) => {
  return apiClient.delete(`/admin/${contextType}/${contextId}/questions/${questionId}`);
};

export const linkQuestionToQuiz = async (quizId, questionId) => {
  return apiClient.post(`/admin/quizzes/${quizId}/questions/${questionId}`);
};
