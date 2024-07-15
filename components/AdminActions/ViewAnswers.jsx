import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { fetchAnswers } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ViewAnswers = ({ route }) => {
  const { quizId } = route.params;
  const [answers, setAnswers] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAnswers(quizId);
        setAnswers(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch answers');
      }
    };

    fetchData();
  }, [quizId]);

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={answers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.answerItem}>
            <Text style={styles.answerText}>{`${item.userId.username}: ${item.answers}`}</Text>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default ViewAnswers;
