import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchQuestions, submitAnswer } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/stylesOld';
import { TranslationContext } from '../../context/TranslationContext';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions();
        setQuestions(response.data);
      } catch (error) {
        Alert.alert(translations.error || 'Error', translations.failedToLoadQuestions || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [translations]);

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === null) {
      Alert.alert(translations.error || 'Error', translations.selectAnswer || 'Please select an answer before submitting.');
      return;
    }

    try {
      const { _id } = questions[currentQuestion];
      const response = await submitAnswer({ questionId: _id, answer: selectedAnswer });
      if (response.data.isCorrect) {
        setScore(score + 1);
      }
    } catch (error) {
      Alert.alert(translations.error || 'Error', translations.failedToSubmitAnswer || 'Failed to submit answer');
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      Alert.alert(translations.quizCompleted || 'Quiz Completed', `${translations.yourScoreIs || 'Your score is:'} ${score}`);
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

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <Text>{translations.noQuestionsAvailable || 'No questions available.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>{questions[currentQuestion].questionText}</Text>
      {questions[currentQuestion].options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={selectedAnswer === option ? styles.selectedOption : styles.option}
          onPress={() => setSelectedAnswer(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.primaryButton} onPress={handleAnswerSubmit}>
        <Text style={styles.buttonText}>{translations.submitAnswer || 'Submit Answer'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Quiz;
