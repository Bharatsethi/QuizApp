import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { fetchTopicContent } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/stylesOld';
import { TranslationContext } from '../../context/TranslationContext';

const ViewTopicContent = ({ route }) => {
  const { topicId } = route.params;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetchTopicContent(topicId);
        setContent(response.data.content);
      } catch (error) {
        console.error('Failed to fetch topic content:', error);
        Alert.alert(translations.error, translations.failedToFetchContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [topicId, translations.error, translations.failedToFetchContent]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>{translations.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{translations.topic} {translations.content}</Text>
        <Text style={styles.contentText}>{content}</Text>
      </ScrollView>
    </View>
  );
};

export default ViewTopicContent;
