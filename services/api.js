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

export const fetchTopics = async (lessonId) => {
  return axios.get(`${API_URL}/lessons/${lessonId}/topics`);
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
