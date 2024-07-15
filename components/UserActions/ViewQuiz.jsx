import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import { fetchQuizByLessonId, submitAnswer } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ViewQuiz = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizByLessonId(lessonId);
        setQuiz(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch quiz');
      }
    };

    fetchData();
  }, [lessonId]);

  const handleInputChange = (questionId, text) => {
    setAnswers({ ...answers, [questionId]: text });
  };

  const handleSubmit = async () => {
    try {
      await submitAnswer(quiz._id, answers);
      Alert.alert('Success', 'Quiz submitted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit quiz');
    }
  };

  if (!quiz) {
    return (
      <View style={styles.container}>
        <Header />
        <Text>Loading...</Text>
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
          <View style={styles.quizItem}>
            <Text style={styles.quizQuestion}>{item.questionText}</Text>
            <TextInput
              style={styles.quizInput}
              value={answers[item._id]}
              onChangeText={(text) => handleInputChange(item._id, text)}
              placeholder="Type your answer here"
            />
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
      <Button title={translations.submit} onPress={handleSubmit} />
    </View>
  );
};

export default ViewQuiz;
