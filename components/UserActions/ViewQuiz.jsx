import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { fetchQuizByLessonId, submitAnswer } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/stylesOld';

const ViewQuiz = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizByLessonId(lessonId);
        setQuiz(response.data);
      } catch (error) {
        Alert.alert(translations.error, translations.failedToFetchQuiz);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lessonId, translations.error, translations.failedToFetchQuiz]);

  const handleInputChange = (questionId, text) => {
    setAnswers({ ...answers, [questionId]: text });
  };

  const handleSubmit = async () => {
    try {
      await submitAnswer(quiz._id, answers);
      Alert.alert(translations.success, translations.quizSubmitted);
      navigation.goBack();
    } catch (error) {
      Alert.alert(translations.error, translations.failedToSubmitQuiz);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{translations.loading}</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.container}>
        <Header />
        <Text>{translations.noQuizAvailable}</Text>
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
              placeholder={translations.typeYourAnswer}
            />
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{translations.submit}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ViewQuiz;
