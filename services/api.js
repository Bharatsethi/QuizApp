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

export const register = async (userData) => {
  return apiClient.post('/register', userData);
};

export const login = async (userData) => {
  return apiClient.post('/login', userData);
};

export const fetchPlans = async () => {
  return apiClient.get('/plans');
};

export const requestAccess = async (data) => {
  return apiClient.post('/request-access', data);
};

export const fetchQuizByLessonId = async (lessonId) => {
  return apiClient.get(`/lessons/${lessonId}/quiz`);
};

export const fetchQuizzesByPlanId = async (planId) => {
  return apiClient.get(`/plans/${planId}/quizzes`);
};

export const checkUserAccess = async (userId) => {
  return apiClient.get(`/user-access/${userId}`);
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

export const fetchChapters = async (planId) => {
  return apiClient.get(`/plans/${planId}/chapters`);
};

export const createChapter = async (chapterData) => {
  return apiClient.post('/admin/chapters', chapterData);
};

export const updateChapter = async (chapterId, chapterData) => {
  return apiClient.put(`/admin/chapters/${chapterId}`, chapterData);
};

export const deleteChapter = async (chapterId) => {
  return apiClient.delete(`/admin/chapters/${chapterId}`);
};

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

export const fetchQuestions = async () => {
  return apiClient.get('/questions');
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

export const reportIssue = async (reportData) => {
  return apiClient.post('/report', reportData);
};

export const forgotPassword = async (emailData) => {
  return apiClient.post('/forgot-password', emailData);
};

export const fetchUsers = async () => {
  return apiClient.get('/users');
};

export const createAdmin = async (userData) => {
  return apiClient.post('/superuser/admin', userData);
};

export const deleteUser = async (userId) => {
  return apiClient.delete(`/superuser/users/${userId}`);
};

export const fetchMessages = async () => {
  return apiClient.get('/messages');
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

export const fetchTranslations = async () => {
  return apiClient.get('/admin/translations');
};

export const saveTranslations = async (translations) => {
  return apiClient.post('/admin/translations', translations);
};
