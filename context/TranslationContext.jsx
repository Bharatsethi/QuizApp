import React, { createContext, useState, useEffect } from 'react';
import { fetchTranslations } from '../services/api';

export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [translations, setTranslations] = useState({
    plan: 'Plan',
    chapter: 'Chapter',
    lesson: 'Lesson',
    topic: 'Topic',
    question: 'Question',
    answer: 'Answer',
    quiz: 'Quiz',
    admin: 'Admin',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    enterEmail: 'Enter your email',
    enterUsername: 'Enter your username',
    enterPassword: 'Enter your password',
    userRegisteredSuccessfully: 'User registered successfully',
    success: 'Success',
    error: 'Error',
    somethingWentWrong: 'Something went wrong',
    welcomeMessageRegister: 'Welcome to our Quiz App! Join us and start learning today.',
    register: 'Register',
    backToLogin: 'Back to Login',
    backButton: 'Back to Dashboard',
    welcomeMessage: 'Welcome to our Quiz App! Enjoy learning with our interactive quizzes.',
    login: 'Login',
    forgotPassword: 'Forgot Password',
    invalidToken: 'Invalid token received',
    loggedInSuccessfully: 'Logged in successfully',
    passwordResetEmailSent: 'Password reset email sent',
    passwordResetError: 'Error sending password reset email',
    sendPasswordResetEmail: 'Send Password Reset Email',
    optional: 'Optional',
    save: 'Save',
    cancel: 'Cancel',
    actions: 'Actions',
    addAdmin: 'Add Admin',
    logout: 'Logout',
    searchPlaceholder: 'Search users...',
    userUpdatedSuccessfully: 'User detail has been updated',
    saveTranslation: 'Save Dictionary',
    failedToFetchQuizzes: 'Failed to fetch quizzes. Please try again later.',
    planDetails: 'Plan Details',
    noQuizzesAvailable: 'No quizzes available for this plan.',
    yourAnswer: 'Your Answer',
    enterYourAnswer: 'Enter your answer',
    submit: 'Submit',
    answerSubmitted: 'Answer submitted',
    failedToSubmitAnswer: 'Failed to submit answer',
    loading: 'Loading...',
    failedToFetchTopics: 'Failed to fetch topics',
    noTopicsAvailable: 'No topics available'
  });

  const setTranslationContext = (newTranslations) => {
    setTranslations((prevTranslations) => ({
      ...prevTranslations,
      ...newTranslations,
    }));
  };

  useEffect(() => {
    const getTranslations = async () => {
      try {
        const response = await fetchTranslations();
        if (response.data) {
          setTranslations((prevTranslations) => ({
            ...prevTranslations,
            ...response.data,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch translations:', error);
      }
    };

    getTranslations();
  }, []);

  return (
    <TranslationContext.Provider value={{ translations, setTranslationContext }}>
      {children}
    </TranslationContext.Provider>
  );
};
