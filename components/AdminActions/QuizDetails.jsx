import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { fetchQuizById, submitQuiz } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const QuizDetails = ({ navigation, route }) => {
  const { quizId } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch quiz details');
      }
    };

    fetchData();
  }, [quizId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async () => {
    try {
      const userId = 'currentUserId'; // Replace with actual current user ID
      const answersArray = Object.keys(answers).map((questionId) => ({
        questionId,
        answer: answers[questionId],
        userId,
      }));
      await submitQuiz(quizId, answersArray);
      Alert.alert('Success', 'Quiz submitted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit quiz');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {quiz && (
        <FlatList
          data={quiz.questions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.questionItem}>
              <Text style={styles.questionText}>{item.text}</Text>
              <TextInputimport React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { fetchQuizById, submitQuiz } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const QuizDetails = ({ navigation, route }) => {
  const { quizId } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        Alert.alert(translations.error || 'Error', translations.failedToFetchQuizDetails || 'Failed to fetch quiz details');
      }
    };

    fetchData();
  }, [quizId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async () => {
    try {
      const userId = 'currentUserId'; // Replace with actual current user ID
      const answersArray = Object.keys(answers).map((questionId) => ({
        questionId,
        answer: answers[questionId],
        userId,
      }));
      await submitQuiz(quizId, answersArray);
      Alert.alert(translations.success || 'Success', translations.quizSubmittedSuccessfully || 'Quiz submitted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToSubmitQuiz || 'Failed to submit quiz');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {quiz && (
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
      )}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{translations.submit || 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizDetails;

                style={styles.input}
                onChangeText={(text) => handleAnswerChange(item._id, text)}
                value={answers[item._id] || ''}
              />
            </View>
          )}
          contentContainerStyle={styles.contentContainer}
        />
      )}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{translations.submit}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuizDetails;
