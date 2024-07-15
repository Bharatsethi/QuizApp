import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchQuestions, submitAnswer } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetchQuestions();
        setQuestions(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer before submitting.');
      return;
    }

    try {
      const { _id } = questions[currentQuestion];
      const response = await submitAnswer({ questionId: _id, answer: selectedAnswer });
      if (response.data.isCorrect) {
        setScore(score + 1);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer');
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      Alert.alert('Quiz Completed', `Your score is: ${score}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <Text>No questions available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>{questions[currentQuestion].questionText}</Text>
      {questions[currentQuestion].options.map((option, index) => (
        <Button
          key={index}
          title={option}
          onPress={() => setSelectedAnswer(option)}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleAnswerSubmit}>
        <Text style={styles.buttonText}>Submit Answer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Quiz;
