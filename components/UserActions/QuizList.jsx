import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Header from '../General/Header';
import styles from '../General/styles';

const QuizList = ({ route, navigation }) => {
  const { quizzes } = route.params;

  const handleViewQuiz = (quiz) => {
    navigation.navigate('ViewQuiz', { quizId: quiz._id });
  };

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.quizItem}>
            <Text style={styles.quizText}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleViewQuiz(item)}>
              <Text style={styles.viewQuizText}>View Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default QuizList;
