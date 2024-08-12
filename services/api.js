import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Use the API URL from the .env file or default to a specific URL if not set
const API_URL = process.env.API_URL || 'http://192.168.0.232:3002';

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

export const deletePlan = async (planId, adminId) => {
  return apiClient.delete(`/admin/plans/${planId}`, {
    data: { adminId },
  });
};

// Add user to plan
export const addUserToPlan = (planId, userId) => {
  return apiClient.post(`/admin/plans/${planId}/users/${userId}`);
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

export const deleteChapter = (chapterId, action = 'delete', planId, adminId) => {
  return apiClient.delete(`/admin/chapters/${chapterId}`, {
    data: { action, planId, adminId },
  });
};


// Users
export const fetchUsers = async () => {
  return apiClient.get('/users');
};

export const fetchUsersbyAdmin = async () => {
  return apiClient.get('/admin/users');
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


export const deleteLesson = (lessonId, action = 'delete', chapterId, adminId) => {
  return apiClient.delete(`/admin/lessons/${lessonId}`, {
    data: { action, chapterId, adminId },
  });
};

export const linkQuiz = async (quizId) => {
  return apiClient.post(`/admin/link-quiz`);
};

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

export const deleteTopic = (topicId, action = 'delete', lessonId, adminId) => {
  return apiClient.delete(`/admin/topics/${topicId}`, {
    data: { action, lessonId, adminId },
  });
};


export const fetchAnswers = async (quizId) => {
  return apiClient.get(`/quiz/${quizId}/answers`);
};

export const submitAnswer = async (answerData) => {
  return apiClient.post('/answers', answerData);
};

export const linkQuizToContext = async (contextId, quizId, adminId) => {
  return apiClient.post(`/admin/context/${contextId}/quizzes/${quizId}`, {
    data: { adminId },
  });
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

export const fetchQuestions = async (adminId, quizId) => {
  const params = { adminId };
  if (quizId) params.quizId = quizId;
  return apiClient.get('/admin/questions', { params });
};

export const createQuestion = async (questionData) => {
  try {
    const response = await apiClient.post('/admin/questions', questionData);
    return response; // Ensure response is returned and not just response.data
  } catch (error) {
    console.error('Failed to create question route:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to resequence questions
export const resequenceQuestions = async (quizId, questionIds) => {
  try {
    const response = await apiClient.post(`/admin/quizzes/${quizId}/resequence`, { questionIds });
    return response.data;
  } catch (error) {
    console.error('Failed to resequence questions:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const loadQuestions = async () => {
  try {
    const adminId = user?.userId;
    const response = await fetchQuestions(adminId);
    setQuestions(response.data);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
  }
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

export const linkQuestionToQuiz = async (quizId, questionId, adminId) => {
  try {
    const response = await apiClient.post(`/admin/quizzes/${quizId}/questions/${questionId}`, { adminId });
    return response.data;
  } catch (error) {
    console.error('Failed to link question:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Quizzes
export const fetchQuizByLessonId = async (lessonId) => {
  return apiClient.get(`/lessons/${lessonId}/quiz`);
};

export const fetchQuizzesByPlanId = async (planId) => {
  return apiClient.get(`/plans/${planId}/quizzes`);
};

export const fetchQuizzes = async (contextId) => {
  try {
    const response = await apiClient.get('/quizzes', {
      params: { contextId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createQuiz = async (quizData) => {
  try {
    const response = await apiClient.post('/admin/quizzes', quizData);
    return response.data;
  } catch (error) {
    console.error('Failed to create quiz:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateQuiz = async (quizId, quizData) => {
  return apiClient.put(`/admin/quizzes/${quizId}`, quizData);
};

export const deleteQuiz = async (quizId, adminId) => {
  return apiClient.delete(`/admin/quizzes/${quizId}`, {
    data: { adminId },
  });
};

export const submitQuiz = async (quizId, answers) => {
  return apiClient.post(`/quizzes/${quizId}/submit`, { answers });
};