import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchQuizzesByPlanId } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const QuizList = ({ navigation, route }) => {
  const { planId } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchQuizzesByPlanId(planId);
        setQuizzes(response.data);
      } catch (error) {
        Alert.alert(translations.error || 'Error', translations.failedToFetchQuizzes || 'Failed to fetch quizzes');
      }
    };

    fetchData();
  }, [planId]);

  const handleViewQuiz = (quizId) => {
    navigation.navigate('QuizDetails', { quizId });
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
            <TouchableOpacity style={styles.viewButton} onPress={() => handleViewQuiz(item._id)}>
              <Icon name="eye" size={20} color="#000" style={styles.icon} />
              <Text style={styles.viewButtonText}>{translations.viewQuiz || 'View Quiz'}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default QuizList;
