import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { fetchAnswers } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const AnswerList = ({ route }) => {
  const { quizId } = route.params;
  const [answers, setAnswers] = useState([]);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAnswers(quizId);
        setAnswers(response.data);
      } catch (error) {
        Alert.alert(translations.error || 'Error', translations.failedToFetchAnswers || 'Failed to fetch answers');
      }
    };

    fetchData();
  }, [quizId, translations]);

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.sectionTitle}>{translations.answers || 'Answers'}</Text>
      <FlatList
        data={answers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.answerItem}>
            <Text style={styles.usernameText}>{item.userId?.username}</Text>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default AnswerList;
