import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { fetchTopics } from '../../services/api';
import Header from '../General/Header';
import styles from '../General/styles';
import { TranslationContext } from '../../context/TranslationContext';

const TopicList = ({ route, navigation }) => {
  const { lessonId } = route.params;
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { translations } = useContext(TranslationContext);

  useEffect(() => {
    const getTopics = async () => {
      try {
        const response = await fetchTopics(lessonId);
        setTopics(response.data);
      } catch (error) {
        Alert.alert('Error', `Failed to load ${translations.topic.toLowerCase()}s`);
      } finally {
        setLoading(false);
      }
    };

    getTopics();
  }, [lessonId]);

  const renderTopicItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planText}>{item.title}</Text>
      <Text style={styles.chapterText}>{item.content}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      {topics.length === 0 ? (
        <Text style={styles.noPlansText}>No {translations.topic.toLowerCase()}s available.</Text>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item._id}
          renderItem={renderTopicItem}
          contentContainerStyle={styles.plansList}
        />
      )}
    </View>
  );
};

export default TopicList;
