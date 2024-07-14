import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { fetchQuestions, submitAnswer } from '../services/api';
import Header from './Header';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      const response = await fetchQuestions();
      setQuestions(response.data);
    };

    loadQuestions();
  }, []);

  const handleAnswerSubmit = async () => {
    const { _id } = questions[currentQuestion];
    const response = await submitAnswer({ questionId: _id, answer: selectedAnswer });
    if (response.data.isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Show final score
      alert(`Your score is: ${score}`);
    }
  };

  if (questions.length === 0) return <Text>Loading...</Text>;

  return (
    <View>
      <Header />
      <Text>{questions[currentQuestion].questionText}</Text>
      {questions[currentQuestion].options.map((option, index) => (
        <Button
          key={index}
          title={option}
          onPress={() => setSelectedAnswer(option)}
        />
      ))}
      <Button title="Submit Answer" onPress={handleAnswerSubmit} />
    </View>
  );
};

export default Quiz;
