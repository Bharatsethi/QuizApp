import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import { fetchAnswers } from '../../services/api';
import Header from '../General/Header';
import { TranslationContext } from '../../context/TranslationContext';
import styles from '../General/styles';

const ViewAnswers = ({ route }) => {
  const { quizId } = route.params;
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAnswers(quizId);
        setAnswers(response.data);
      } catch (error) {
        console.error('Error fetching answers:', error);
        Alert.alert(translations.error || 'Error', translations.failedToFetchAnswers || 'Failed to fetch answers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, translations]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{translations.loading || 'Loading...'}</Text>
      </View>
    );
  }

  if (answers.length === 0) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.noPlansText}>{translations.noAnswers || 'No answers available.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={answers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.answerItem}>
            <Text style={styles.answerText}>
              {`${item.userId?.username || translations.anonymous || 'Anonymous'}: ${item.answers}`}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default ViewAnswers;
