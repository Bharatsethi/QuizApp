import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { fetchTopicContent } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const ViewTopicContent = ({ route }) => {
  const { topicId } = route.params;
  const [content, setContent] = useState('');
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetchTopicContent(topicId);
        setContent(response.data.content);
      } catch (error) {
        console.error('Failed to fetch topic content:', error);
        Alert.alert('Error', 'Failed to fetch topic content. Please try again later.');
      }
    };

    fetchContent();
  }, [topicId]);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{translations.topic} Content</Text>
        <Text style={styles.contentText}>{content}</Text>
      </ScrollView>
    </View>
  );
};

export default ViewTopicContent;
