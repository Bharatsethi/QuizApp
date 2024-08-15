import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { fetchQuizById, submitQuiz } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';

const QuizDetails = ({ navigation, route }) => {
  const { quizId } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        Alert.alert(translations.error || 'Error', translations.failedToFetchQuizDetails || 'Failed to fetch quiz details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, translations]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      Alert.alert(translations.error || 'Error', translations.answerAllQuestions || 'Please answer all questions before submitting.');
      return;
    }

    try {
      const answersArray = Object.keys(answers).map((questionId) => ({
        questionId,
        answer: answers[questionId],
        userId: user.userId,
      }));
      await submitQuiz(quizId, answersArray);
      Alert.alert(translations.success || 'Success', translations.quizSubmittedSuccessfully || 'Quiz submitted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Quiz submission failed:', error.response?.data || error.message);
      Alert.alert(translations.error || 'Error', translations.failedToSubmitQuiz || 'Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{translations.loading || 'Loading...'}</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.container}>
        <Header />
        <Text>{translations.failedToLoadQuiz || 'Failed to load quiz details.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={quiz.questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.questionItem}>
            <Text style={styles.questionText}>{item.text}</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => handleAnswerChange(item._id, text)}
              value={answers[item._id] || ''}
              placeholder={translations.enterAnswer || 'Enter your answer'}
            />
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{translations.submit || 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizDetails;
