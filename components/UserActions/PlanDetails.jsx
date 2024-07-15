import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { fetchQuizzesByPlanId } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const PlanDetails = ({ route, navigation }) => {
  const { planId } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetchQuizzesByPlanId(planId);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        Alert.alert('Error', 'Failed to fetch quizzes. Please try again later.');
      }
    };

    fetchQuizzes();
  }, [planId]);

  const renderQuizItem = ({ item }) => (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={() => navigation.navigate('ViewQuiz', { quizId: item._id })}
    >
      <Text style={styles.quizText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>{translations.plan} Details</Text>
      {quizzes.length === 0 ? (
        <Text style={styles.noQuizzesText}>No quizzes available for this plan.</Text>
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

export default PlanDetails;
