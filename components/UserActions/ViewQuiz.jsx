import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { fetchQuizDetails, submitQuizAnswer } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import { UserContext } from '../../context/UserContext';
import styles from '../General/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewQuiz = ({ route, navigation }) => {
  const { quizId } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const { translations } = useContext(TranslationContext);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizDetails(quizId);
        setQuiz(response.data);
      } catch (error) {
        Alert.alert(translations.error, translations.failedToFetchQuiz || 'Failed to fetch quiz details.');
      }
    };

    fetchData();
  }, [quizId, translations.error, translations.failedToFetchQuiz]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await submitQuizAnswer(quizId, answers, user.userId);
      if (response.status === 200) {
        Alert.alert(translations.success || 'Success', translations.quizSubmittedSuccessfully || 'Quiz submitted successfully!');
        navigation.goBack();
      } else {
        Alert.alert(translations.error, translations.failedToSubmitQuiz || 'Failed to submit quiz. Please try again.');
      }
    } catch (error) {
      console.error('Submit Quiz error:', error);
      Alert.alert(translations.error, translations.failedToSubmitQuiz || 'Failed to submit quiz. Please try again.');
    }
  };

  const renderQuestion = ({ item }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.question}</Text>
      <FlatList
        data={item.options}
        keyExtractor={(option) => option._id}
        renderItem={({ item: option }) => (
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => handleAnswerChange(item._id, option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  if (!quiz) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.loadingText}>{translations.loadingQuiz || 'Loading quiz...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={16} color="#fff" />
          <Text style={styles.backButtonText}>{translations.backToPrevious || 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{quiz.title}</Text>
        <FlatList
          data={quiz.questions}
          keyExtractor={(item) => item._id}
          renderItem={renderQuestion}
          contentContainerStyle={styles.quizContentContainer}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmitQuiz}>
          <Text style={styles.buttonText}>{translations.submitQuiz || 'Submit Quiz'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ViewQuiz;
