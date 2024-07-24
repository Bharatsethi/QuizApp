const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  translation: { type: String, default: 'Exist' },
  plan: { type: String, default: 'Plan' },
  chapter: { type: String, default: 'Chapter' },
  lesson: { type: String, default: 'Lesson' },
  topic: { type: String, default: 'Topic' },
  question: { type: String, default: 'Question' },
  answer: { type: String, default: 'Answer' },
  admin: { type: String, default: 'Admin' },
  username: { type: String, default: 'Username' },
  email: { type: String, default: 'Email' },
  password: { type: String, default: 'Password' },
  enterEmail: { type: String, default: 'Enter your email' },
  enterUsername: { type: String, default: 'Enter your username' },
  enterPassword: { type: String, default: 'Enter your password' },
  userRegisteredSuccessfully: { type: String, default: 'User registered successfully' },
  success: { type: String, default: 'Success' },
  error: { type: String, default: 'Error' },
  somethingWentWrong: { type: String, default: 'Something went wrong' },
  welcomeMessageRegister: { type: String, default: 'Welcome to our Quiz App! Join us and start learning today.' },
  register: { type: String, default: 'Register' },
  backToLogin: { type: String, default: 'Back to Login' },
  welcomeMessage: { type: String, default: 'Welcome to our Quiz App! Enjoy learning with our interactive quizzes.' },
  login: { type: String, default: 'Login' },
  forgotPassword: { type: String, default: 'Forgot Password' },
  invalidToken: { type: String, default: 'Invalid token received' },
  loggedInSuccessfully: { type: String, default: 'Logged in successfully' },
  passwordResetEmailSent: { type: String, default: 'Password reset email sent' },
  passwordResetError: { type: String, default: 'Error sending password reset email' },
  sendPasswordResetEmail: { type: String, default: 'Send Password Reset Email' },
  optional: { type: String, default: 'Optional' },
  saveButton: { type: String, default: 'Save' },
  cancel: { type: String, default: 'Cancel' },
  actions: { type: String, default: 'Actions' },
  addAdmin: { type: String, default: 'Add Admin' },
  logout: { type: String, default: 'Logout' },
  searchPlaceholder: { type: String, default: 'Search users...' },
  userUpdatedSuccessfully: { type: String, default: 'User detail has been updated' },
  saveTranslation: { type: String, default: 'Save Dictionary' },
  failedToFetchQuizzes: { type: String, default: 'Failed to fetch quizzes. Please try again later.' },
  planDetails: { type: String, default: 'Plan Details' },
  noQuizzesAvailable: { type: String, default: 'No quizzes available for this plan.' },
  yourAnswer: { type: String, default: 'Your Answer' },
  enterYourAnswer: { type: String, default: 'Enter your answer' },
  submit: { type: String, default: 'Submit' },
  answerSubmitted: { type: String, default: 'Answer submitted' },
  failedToSubmitAnswer: { type: String, default: 'Failed to submit answer' },
  loading: { type: String, default: 'Loading...' },
  failedToFetchTopics: { type: String, default: 'Failed to fetch topics' },
  noTopicsAvailable: { type: String, default: 'No topics available' }
},  { suppressReservedKeysWarning: true });

module.exports = mongoose.model('Translation', translationSchema);
