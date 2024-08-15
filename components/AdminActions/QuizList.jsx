import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { fetchQuizzesByPlanId } from '../../services/api';
import Header from '../General/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const QuizList = ({ navigation, route }) => {
  const { planId } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchQuizzesByPlanId(planId);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchQuizzes || 'Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId, translations]);

  const handleViewQuiz = (quizId) => {
    navigation.navigate('QuizDetails', { quizId });
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

  return (
    <View style={styles.container}>
      <Header />
      {quizzes.length === 0 ? (
        <Text style={styles.emptyListText}>{translations.noQuizzesAvailable || 'No quizzes available.'}</Text>
      ) : (
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
      )}
    </View>
  );
};

export default QuizList;
