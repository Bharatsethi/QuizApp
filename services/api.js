import axios from 'axios';

const API_URL = 'http://192.168.0.75:3002';

export const register = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = async (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

export const fetchPlans = async () => {
  return axios.get(`${API_URL}/plans`);
};

export const requestAccess = async (data) => {
  return axios.post(`${API_URL}/request-access`, data);
};

export const fetchQuizByLessonId = async (lessonId) => {
  return axios.get(`${API_URL}/lessons/${lessonId}/quiz`);
};

export const fetchQuizzesByPlanId = async (planId) => {
  return axios.get(`${API_URL}/plans/${planId}/quizzes`);
};

export const checkUserAccess = async (userId) => {
  return axios.get(`${API_URL}/user-access/${userId}`);
};

export const fetchPlanById = async (planId) => {
  return axios.get(`${API_URL}/plans/${planId}`);
};

export const createPlan = async (planData) => {
  return axios.post(`${API_URL}/admin/plans`, planData);
};

export const updatePlan = async (planId, planData) => {
  return axios.put(`${API_URL}/admin/plans/${planId}`, planData);
};

export const deletePlan = async (planId) => {
  return axios.delete(`${API_URL}/admin/plans/${planId}`);
};

export const fetchChapters = async (planId) => {
  return axios.get(`${API_URL}/plans/${planId}/chapters`);
};

export const createChapter = async (chapterData) => {
  return axios.post(`${API_URL}/admin/chapters`, chapterData);
};

export const updateChapter = async (chapterId, chapterData) => {
  return axios.put(`${API_URL}/admin/chapters/${chapterId}`, chapterData);
};

export const deleteChapter = async (chapterId) => {
  return axios.delete(`${API_URL}/admin/chapters/${chapterId}`);
};

export const fetchLessons = async (chapterId) => {
  return axios.get(`${API_URL}/chapters/${chapterId}/lessons`);
};

export const createLesson = async (lessonData) => {
  return axios.post(`${API_URL}/admin/lessons`, lessonData);
};

export const updateLesson = async (lessonId, lessonData) => {
  return axios.put(`${API_URL}/admin/lessons/${lessonId}`, lessonData);
};

export const deleteLesson = async (lessonId) => {
  return axios.delete(`${API_URL}/admin/lessons/${lessonId}`);
};

export const fetchTopics = async (lessonId) => {
  return axios.get(`${API_URL}/lessons/${lessonId}/topics`);
};

export const createTopic = async (topicData) => {
  return axios.post(`${API_URL}/admin/topics`, topicData);
};

export const updateTopic = async (topicId, topicData) => {
  return axios.put(`${API_URL}/admin/topics/${topicId}`, topicData);
};

export const deleteTopic = async (topicId) => {
  return axios.delete(`${API_URL}/admin/topics/${topicId}`);
};

export const fetchQuestions = async () => {
  return axios.get(`${API_URL}/questions`);
};

export const createQuiz = async (quizData) => {
  return axios.post(`${API_URL}/admin/quizzes`, quizData);
};

export const updateQuiz = async (quizId, quizData) => {
  return axios.put(`${API_URL}/admin/quizzes/${quizId}`, quizData);
};

export const deleteQuiz = async (quizId) => {
  return axios.delete(`${API_URL}/admin/quizzes/${quizId}`);
};

export const submitQuiz = async (quizId, answers) => {
  return axios.post(`${API_URL}/quizzes/${quizId}/submit`, { answers });
};

export const fetchAnswers = async (quizId) => {
  return axios.get(`${API_URL}/quiz/${quizId}/answers`);
};

export const submitAnswer = async (answerData) => {
  return axios.post(`${API_URL}/answers`, answerData);
};

export const reportIssue = async (reportData) => {
  return axios.post(`${API_URL}/report`, reportData);
};

export const forgotPassword = async (emailData) => {
  return axios.post(`${API_URL}/forgot-password`, emailData);
};

export const fetchUsers = async () => {
  return axios.get(`${API_URL}/users`);
};

export const createAdmin = async (userData) => {
  return axios.post(`${API_URL}/superuser/admin`, userData);
};

export const deleteUser = async (userId) => {
  return axios.delete(`${API_URL}/superuser/users/${userId}`);
};

export const fetchMessages = async () => {
  return axios.get(`${API_URL}/messages`);
};

export const createMessage = async (messageData) => {
  return axios.post(`${API_URL}/admin/messages`, messageData);
};

export const updateMessage = async (messageId, messageData) => {
  return axios.put(`${API_URL}/admin/messages/${messageId}`, messageData);
};

export const deleteMessage = async (messageId) => {
  return axios.delete(`${API_URL}/admin/messages/${messageId}`);
};

export const fetchTranslations = async () => {
  return axios.get(`${API_URL}/admin/translations`);
};

export const saveTranslations = async (translations) => {
  return axios.post(`${API_URL}/admin/translations`, translations);
};
