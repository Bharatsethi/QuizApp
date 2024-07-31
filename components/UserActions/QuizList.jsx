import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Header from '../General/Header';
import styles from '../General/stylesOld';
import { TranslationContext } from '../../context/TranslationContext';

const QuizList = ({ route, navigation }) => {
  const { quizzes } = route.params;
  const { translations } = React.useContext(TranslationContext);

  const handleViewQuiz = (quiz) => {
    navigation.navigate('ViewQuiz', { quizId: quiz._id });
  };

  const renderQuizItem = ({ item }) => (
    <View style={styles.quizItem}>
      <Text style={styles.quizText}>{item.title}</Text>
      <TouchableOpacity style={styles.viewQuizButton} onPress={() => handleViewQuiz(item)}>
        <Text style={styles.viewQuizButtonText}>{translations.viewQuiz || 'View Quiz'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      {quizzes.length === 0 ? (
        <Text style={styles.noQuizzesText}>{translations.noQuizzesAvailable || 'No quizzes available.'}</Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item._id}
          renderItem={renderQuizItem}
          contentContainerStyle={styles.contentContainer}
        />
      )}
    </View>
  );
};

export default QuizList;
